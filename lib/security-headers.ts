// Centralised security response headers, applied globally via next.config headers().
// Kept in its own module so it can be unit-tested independently of the Next config.
//
// CSP note: Next.js injects inline bootstrap/hydration scripts and Tailwind emits
// inline styles, so script-src/style-src must allow 'unsafe-inline' here. connect-src
// is restricted to the only external origins the app talks to: Supabase (auth + data)
// and the AlQuran API. Tighten to nonce-based CSP only once Next nonce middleware is wired up.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.alquran.cloud",
  "upgrade-insecure-requests",
].join('; ')

export const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
] as const
