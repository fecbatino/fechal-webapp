#!/usr/bin/env node
/**
 * Portfolio-Bild-Pipeline (Variante A: Browser-Mockup-Frame).
 *
 * Erzeugt für jedes Web-Projekt einen validierten Live-Screenshot im
 * gezeichneten Browser-Rahmen und für Nicht-Web-Projekte eine Branded Card
 * in derselben Designsprache. Ausgabe: public/portfolio/{slug}.webp + .png
 * (1280×800, 16:10).
 *
 * Sicherheitsnetz:
 *  - Pre-Check: Ziel-URL muss HTTP 200 liefern, sonst wird das Projekt
 *    übersprungen (altes Bild bleibt liegen).
 *  - Post-Check: gerenderter Seitentext wird auf Fehlerseiten-Muster und
 *    Mindestinhalt geprüft, bevor das Bild gespeichert wird.
 *  - Last-known-good: Schreiben erfolgt atomar (tmp + rename) und nur nach
 *    bestandener Validierung. Jeder Fehler ⇒ Exit-Code 1.
 *
 * Die eigene Domain ist aus dem Docker-Netz nicht direkt erreichbar
 * (NAT-Hairpin ⇒ ERR_CONNECTION_REFUSED – genau so entstand das kaputte
 * Bild von Commit ed6afd0). Deshalb mappt Chromium alle Projekt-Domains per
 * --host-resolver-rules auf die interne IP des nginx-proxy-manager.
 * Nicht parallel zu einem Deploy ausführen – erst nach bestandenem
 * Healthcheck (docker ps ⇒ "healthy").
 *
 * Aufruf (auf dem Host):
 *   node scripts/generate-portfolio-images.mjs [slug ...]
 * Env-Overrides: BROWSERLESS_URL, BROWSERLESS_TOKEN, PROXY_IP
 */

import { execFileSync } from 'node:child_process'
import { request as httpsRequest } from 'node:https'
import { mkdirSync, renameSync, writeFileSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = resolve(ROOT, 'public/portfolio')

// ---------------------------------------------------------------------------
// Projekt-Konfiguration
// ---------------------------------------------------------------------------

/** @type {Array<SiteJob | CardJob>} */
const PROJECTS = [
  {
    kind: 'site',
    slug: 'hajj-umrah',
    url: 'https://hu.fechal-batakpale.com/',
    waitSelector: 'h1',
  },
  {
    kind: 'site',
    slug: 'aikf-kiosk',
    url: 'https://kiosk.fechal-batakpale.com/',
    waitSelector: 'body',
  },
  {
    kind: 'site',
    slug: 'hizbulazam',
    url: 'https://hza.fechal-batakpale.com/',
    waitSelector: 'body',
  },
  // Eigene Domain bewusst zuletzt: nach einem Deploy zuerst die fremden
  // Seiten, damit ein noch startender eigener Container den Lauf nicht kippt.
  {
    kind: 'site',
    slug: 'fechal-webapp',
    url: 'https://fechal-batakpale.com/de',
    waitSelector: 'h1',
  },
  {
    kind: 'card',
    slug: 'hermes-agent',
    title: 'Hermes Agent',
    subtitle: 'KI-Agenten-Orchestrierung · DevOps Automation',
    pills: ['Claude Code', 'n8n', 'OpenRouter', 'Docker'],
    // Lucide "bot"
    iconPath:
      '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  },
]

const VIEWPORT = { width: 1440, height: 900 }
const OUTPUT = { width: 1280, height: 800 }
const MIN_RAW_BYTES = 20_000
const MIN_VISIBLE_CHARS = 200
const ERROR_PAGE_PATTERN =
  /ERR_[A-Z_]+|can't be reached|refused to connect|502 Bad Gateway|503 Service|504 Gateway|Internal Server Error|This page isn't working/i

// Cookie-/Consent-Banner vor dem Shot ausblenden.
const HIDE_CSS = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [aria-label*="cookie" i], .cc-window, #CybotCookiebotDialog { display: none !important; }
`

// ---------------------------------------------------------------------------
// Infrastruktur-Auflösung
// ---------------------------------------------------------------------------

function dockerInspect(args) {
  return execFileSync('docker', ['inspect', ...args], { encoding: 'utf8' }).trim()
}

function resolveInfra() {
  const proxyIp =
    process.env.PROXY_IP ||
    dockerInspect(['nginx-proxy-manager', '--format', '{{(index .NetworkSettings.Networks "web-network").IPAddress}}'])
  const browserlessUrl =
    process.env.BROWSERLESS_URL ||
    'http://' +
      dockerInspect(['browserless', '--format', '{{(index .NetworkSettings.Networks "web-network").IPAddress}}']) +
      ':3000'
  const token =
    process.env.BROWSERLESS_TOKEN ||
    dockerInspect(['browserless', '--format', '{{range .Config.Env}}{{println .}}{{end}}'])
      .split('\n')
      .find((l) => l.startsWith('TOKEN='))
      ?.slice('TOKEN='.length)
  if (!token) throw new Error('Browserless-Token nicht gefunden (BROWSERLESS_TOKEN setzen)')
  return { proxyIp, browserlessUrl, token }
}

// ---------------------------------------------------------------------------
// Browserless-Helfer
// ---------------------------------------------------------------------------

function launchParam(proxyIp) {
  // Alle Projekt-Domains intern über den Proxy auflösen (NAT-Hairpin-Fix).
  return JSON.stringify({
    args: [`--host-resolver-rules=MAP *.fechal-batakpale.com ${proxyIp},MAP fechal-batakpale.com ${proxyIp}`],
  })
}

async function browserless(infra, endpoint, payload) {
  const url =
    `${infra.browserlessUrl}/${endpoint}?token=${encodeURIComponent(infra.token)}` +
    `&launch=${encodeURIComponent(launchParam(infra.proxyIp))}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`browserless /${endpoint} ⇒ HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

/** HTTP-Status der Ziel-URL prüfen – über den Proxy, wie Chromium ihn sieht. */
function preflight(infra, url) {
  const { hostname, pathname } = new URL(url)
  return new Promise((resolveStatus) => {
    const req = httpsRequest(
      {
        host: infra.proxyIp,
        servername: hostname, // SNI, damit NPM das richtige Zertifikat wählt
        path: pathname,
        headers: { Host: hostname },
        timeout: 15_000,
      },
      (res) => {
        res.resume()
        // Redirects (z. B. / ⇒ /de) gelten als erreichbar.
        const ok = res.statusCode >= 200 && res.statusCode < 400
        resolveStatus({ ok, status: res.statusCode })
      },
    )
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.on('error', (e) => resolveStatus({ ok: false, status: e.message }))
    req.end()
  })
}

// ---------------------------------------------------------------------------
// Templates (Variante A)
// ---------------------------------------------------------------------------

function browserFrameHtml(rawPngBase64, domain) {
  return `<!DOCTYPE html><html><head><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${OUTPUT.width}px; height:${OUTPUT.height}px; display:flex; align-items:center; justify-content:center;
         background: linear-gradient(135deg, #f0fdfa 0%, #e6f7f4 55%, #d9f2ee 100%); font-family:-apple-system,'Segoe UI',sans-serif; }
  .browser { width:1080px; border-radius:14px; overflow:hidden;
             box-shadow: 0 24px 60px -18px rgba(13,60,53,.28), 0 4px 14px rgba(13,60,53,.10); background:#fff; }
  .titlebar { height:44px; background:#f6f8f8; border-bottom:1px solid #e5eae9; display:flex; align-items:center; padding:0 16px; gap:14px; }
  .dots { display:flex; gap:7px; }
  .dot { width:11px; height:11px; border-radius:50%; }
  .urlbar { flex:1; max-width:520px; margin:0 auto; height:26px; background:#fff; border:1px solid #e2e8e7;
            border-radius:13px; display:flex; align-items:center; justify-content:center; gap:6px;
            font-size:12.5px; color:#5b6b68; }
  .shot { display:block; width:1080px; height:608px; object-fit:cover; object-position:top; }
</style></head><body>
  <div class="browser">
    <div class="titlebar">
      <div class="dots"><div class="dot" style="background:#ff5f57"></div><div class="dot" style="background:#febc2e"></div><div class="dot" style="background:#28c840"></div></div>
      <div class="urlbar"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2.4"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>${domain}</div>
      <div style="width:53px"></div>
    </div>
    <img class="shot" src="data:image/png;base64,${rawPngBase64}">
  </div>
</body></html>`
}

function brandedCardHtml({ title, subtitle, pills, iconPath }) {
  return `<!DOCTYPE html><html><head><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${OUTPUT.width}px; height:${OUTPUT.height}px; font-family:-apple-system,'Segoe UI',sans-serif; position:relative; overflow:hidden;
         background: linear-gradient(135deg, #f0fdfa 0%, #e6f7f4 55%, #d9f2ee 100%); display:flex; align-items:center; justify-content:center; }
  .ring { position:absolute; border-radius:50%; border:1.5px solid rgba(13,148,136,.10); }
  .glow { position:absolute; width:560px; height:560px; border-radius:50%; right:-140px; top:-160px;
          background: radial-gradient(circle, rgba(20,184,166,.14) 0%, transparent 65%); }
  .content { text-align:center; z-index:2; }
  .iconwrap { width:148px; height:148px; margin:0 auto 38px; border-radius:36px;
              background: linear-gradient(145deg, #0b1f3a, #134e48); display:flex; align-items:center; justify-content:center;
              box-shadow: 0 18px 45px -14px rgba(11,31,58,.45); }
  h1 { color:#0b1f3a; font-size:54px; font-weight:700; letter-spacing:-.5px; margin-bottom:14px; }
  .sub { color:#4b6a64; font-size:23px; font-weight:500; margin-bottom:44px; }
  .tech { display:flex; gap:12px; justify-content:center; }
  .pill { padding:9px 20px; border-radius:999px; font-size:17px; font-weight:600; color:#0d7268;
          background:rgba(20,184,166,.10); border:1px solid rgba(13,148,136,.30); }
</style></head><body>
  <div class="ring" style="width:780px;height:780px;left:-260px;bottom:-330px"></div>
  <div class="ring" style="width:520px;height:520px;left:-140px;bottom:-200px"></div>
  <div class="glow"></div>
  <div class="content">
    <div class="iconwrap">
      <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#5eead4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
    </div>
    <h1>${title}</h1>
    <div class="sub">${subtitle}</div>
    <div class="tech">${pills.map((p) => `<span class="pill">${p}</span>`).join('')}</div>
  </div>
</body></html>`
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

function pngLooksValid(buf) {
  return buf.length >= MIN_RAW_BYTES && buf.subarray(0, 8).equals(Buffer.from('\x89PNG\r\n\x1a\n', 'latin1'))
}

/** Atomar speichern – altes Bild bleibt bis zum erfolgreichen rename liegen. */
function commitImage(slug, ext, buf) {
  const tmp = resolve(OUT_DIR, `.${slug}.${ext}.tmp`)
  writeFileSync(tmp, buf)
  renameSync(tmp, resolve(OUT_DIR, `${slug}.${ext}`))
}

async function renderHtml(infra, html, type) {
  return browserless(infra, 'screenshot', {
    html,
    viewport: { width: OUTPUT.width, height: OUTPUT.height },
    options: { type, ...(type === 'webp' ? { quality: 92 } : {}) },
    waitForTimeout: 500,
  })
}

async function processSite(infra, job) {
  // 1. Pre-Check: URL muss erreichbar sein und 200 liefern.
  const pre = await preflight(infra, job.url)
  if (!pre.ok) throw new Error(`Pre-Check fehlgeschlagen (${pre.status}) – altes Bild bleibt`)

  // 2. Gerenderten Seitentext validieren (Fehlerseiten-Muster, Mindestinhalt).
  const contentBuf = await browserless(infra, 'content', {
    url: job.url,
    gotoOptions: { waitUntil: 'networkidle2', timeout: 30_000 },
  })
  const text = contentBuf
    .toString('utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
  if (ERROR_PAGE_PATTERN.test(text)) throw new Error('Fehlerseiten-Muster im Seitentext – verworfen')
  if (text.trim().length < MIN_VISIBLE_CHARS) throw new Error(`Zu wenig Inhalt (${text.trim().length} Zeichen) – verworfen`)

  // 3. Roh-Screenshot.
  const raw = await browserless(infra, 'screenshot', {
    url: job.url,
    viewport: VIEWPORT,
    options: { type: 'png' },
    gotoOptions: { waitUntil: 'networkidle2', timeout: 30_000 },
    waitForSelector: job.waitSelector ? { selector: job.waitSelector, timeout: 15_000 } : undefined,
    waitForTimeout: 2_000,
    addStyleTag: [{ content: HIDE_CSS }],
  })
  if (!pngLooksValid(raw)) throw new Error(`Roh-Screenshot unplausibel (${raw.length} Bytes) – verworfen`)

  // 4. In Browser-Frame setzen, als WebP + PNG rendern.
  const html = browserFrameHtml(raw.toString('base64'), new URL(job.url).hostname)
  const [webp, png] = [await renderHtml(infra, html, 'webp'), await renderHtml(infra, html, 'png')]
  if (!pngLooksValid(png)) throw new Error('Composite-PNG unplausibel – verworfen')

  commitImage(job.slug, 'webp', webp)
  commitImage(job.slug, 'png', png)
}

async function processCard(infra, job) {
  const html = brandedCardHtml(job)
  const [webp, png] = [await renderHtml(infra, html, 'webp'), await renderHtml(infra, html, 'png')]
  if (!pngLooksValid(png)) throw new Error('Branded-Card-PNG unplausibel – verworfen')
  commitImage(job.slug, 'webp', webp)
  commitImage(job.slug, 'png', png)
}

async function main() {
  const only = process.argv.slice(2)
  const jobs = PROJECTS.filter((p) => only.length === 0 || only.includes(p.slug))
  if (jobs.length === 0) {
    console.error(`Kein Projekt passt zu: ${only.join(', ')}`)
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const infra = resolveInfra()
  let failures = 0

  for (const job of jobs) {
    const label = `${job.slug} (${job.kind})`
    try {
      if (job.kind === 'site') await processSite(infra, job)
      else await processCard(infra, job)
      const size = statSync(resolve(OUT_DIR, `${job.slug}.webp`)).size
      console.log(`✓ ${label} – ${(size / 1024).toFixed(0)} KB webp`)
    } catch (err) {
      failures++
      console.error(`✗ ${label}: ${err.message}`)
    }
  }

  if (failures > 0) {
    console.error(`${failures} Projekt(e) fehlgeschlagen – alte Bilder unangetastet.`)
    process.exit(1)
  }
}

main()
