import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'fr', 'en'] as const,
  defaultLocale: 'de',
})
