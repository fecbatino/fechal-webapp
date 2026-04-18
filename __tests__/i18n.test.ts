import { routing } from '../i18n/routing'

describe('i18n routing', () => {
  it('supports de, fr, en locales', () => {
    expect(routing.locales).toContain('de')
    expect(routing.locales).toContain('fr')
    expect(routing.locales).toContain('en')
  })

  it('defaults to de', () => {
    expect(routing.defaultLocale).toBe('de')
  })
})
