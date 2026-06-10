import { routing } from '../i18n/routing'
import de from '../messages/de.json'
import fr from '../messages/fr.json'
import en from '../messages/en.json'
import ar from '../messages/ar.json'

type Json = Record<string, unknown>

function keyPaths(obj: Json, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k
    return v && typeof v === 'object' && !Array.isArray(v)
      ? keyPaths(v as Json, path)
      : [path]
  })
}

const catalogs: Record<string, Json> = { de, fr, en, ar }

describe('message catalogs', () => {
  it('provides a catalog for every routing locale', () => {
    for (const locale of routing.locales) {
      expect(catalogs[locale]).toBeDefined()
    }
  })

  const reference = keyPaths(de).sort()

  for (const locale of ['fr', 'en', 'ar']) {
    it(`${locale}.json has the same keys as de.json (no missing/extra)`, () => {
      expect(keyPaths(catalogs[locale]).sort()).toEqual(reference)
    })
  }
})
