# Extensions (Phase 3)

Setup notes for the four extensions added in Phase 3.

## E1 — CI/CD (GitHub Actions + rsync deploy)

Workflow: `.github/workflows/deploy.yml`. On push to `main` (or manual dispatch):
1. **Build gate** — `npm ci` + `npm run build` (hard gate). `npm run lint` and `npm test`
   run `continue-on-error: true` until the pre-existing next-intl/jest ESM failures and
   the 5 legacy lint errors are fixed (then drop `continue-on-error`).
2. **Deploy** — rsync the source to `root@VPS:/opt/stacks/web/fechal-webapp` (excludes
   `.git`, `node_modules`, `.next`, `.env`, `.claude`), then on the VPS
   `docker compose build fechal-webapp && docker compose up -d fechal-webapp`, then a
   `/de` health check.

Required GitHub repo secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `VPS_SSH_KEY` | private ed25519 key; its public key in the VPS user's `~/.ssh/authorized_keys` |
| `VPS_HOST` | `159.69.204.155` |
| `VPS_USER` | `root` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (build gate) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (build gate) |

The actual image is rebuilt **on the VPS**; build args (Supabase, site URL/name) come from
`/opt/stacks/web/docker-compose.yml`.

## E2 — Uptime monitoring + Telegram alert (n8n)

Workflow: `ops/n8n/uptime-monitor.workflow.json`. Every 5 min: GET
`https://fechal-batakpale.com/de` (full chain Cloudflare → NPM → origin); if the status is
not 200, send a Telegram message.

Setup:
1. In n8n, create a **Telegram** credential (bot token from @BotFather).
2. Import `ops/n8n/uptime-monitor.workflow.json`; replace `__TELEGRAM_CHAT_ID__` with the
   target chat id and bind the Telegram credential to the alert node.
3. Activate the workflow.

The cert-expiry side is covered separately by the one-off remote routine that fires
2026-07-21 (before the npm-14 origin cert expires 2026-07-28).

## E3 — Arabic locale + RTL

`ar` added to `i18n/routing.ts`. Full catalog in `messages/ar.json` (key-parity enforced by
`__tests__/i18n-messages.test.ts`). `app/[locale]/layout.tsx` sets `dir="rtl"` for `ar`.
`LanguageSwitcher` exposes the `ع` button. Content sections backed by trilingual data
(hajj-data, vereine, portfolio) already fall back to German for `ar` via existing `?? .de`
accessors — no Arabic content rows are required for the pages to render.

## E4 — Security headers

`lib/security-headers.ts` is applied globally via `next.config.ts` `headers()`. Ships CSP
(`frame-ancestors 'none'`, `default-src 'self'`, Supabase + AlQuran in `connect-src`),
`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and
HSTS. Verified by `__tests__/security-headers.test.ts`.

Rate-limiting was intentionally **not** added: auth runs client → Supabase directly (not
through this app's middleware/`/api`), so an app-side limiter would not protect the auth
flow; Supabase enforces its own auth rate limits.
