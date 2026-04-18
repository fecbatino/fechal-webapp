import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // next-intl ships ESM-only bundles; Jest (CommonJS) cannot parse them without
  // this transpilation step. Remove only once Jest is configured for ESM or
  // replaced by a native ESM test runner (e.g. Vitest).
  transpilePackages: ['next-intl'],
}

export default withNextIntl(nextConfig)
