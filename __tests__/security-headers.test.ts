import { securityHeaders } from '../lib/security-headers'

describe('security headers', () => {
  const map = new Map(securityHeaders.map((h) => [h.key, h.value]))

  it('sets clickjacking + sniffing protections', () => {
    expect(map.get('X-Frame-Options')).toBe('DENY')
    expect(map.get('X-Content-Type-Options')).toBe('nosniff')
    expect(map.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
  })

  it('ships a CSP that blocks framing and allows only known origins', () => {
    const csp = map.get('Content-Security-Policy') ?? ''
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain('https://*.supabase.co')
    expect(csp).toContain('https://api.alquran.cloud')
  })

  it('enables HSTS', () => {
    expect(map.get('Strict-Transport-Security')).toMatch(/max-age=\d+/)
  })
})
