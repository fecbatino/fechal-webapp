'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const locales = [
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex gap-1">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`px-2 py-1 text-sm rounded ${
            locale === code
              ? 'bg-emerald-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
