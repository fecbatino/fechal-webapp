import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'fr', 'en', 'ar'] as const,
  defaultLocale: 'de',
})

export type Locale = (typeof routing.locales)[number]
