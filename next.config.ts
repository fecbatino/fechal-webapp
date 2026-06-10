import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { securityHeaders } from './lib/security-headers'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // Standalone output for Docker deployment
  output: 'standalone',

  // next-intl ships ESM-only bundles; Jest (CommonJS) cannot parse them without
  // this transpilation step. Remove only once Jest is configured for ESM or
  // replaced by a native ESM test runner (e.g. Vitest).
  transpilePackages: ['next-intl'],

  // Global security headers on every route (see lib/security-headers.ts).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders.map((h) => ({ key: h.key, value: h.value })),
      },
    ]
  },
}

export default withNextIntl(nextConfig)
