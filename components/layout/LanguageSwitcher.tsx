'use client'
import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/lib/navigation'

const locales = [
  { code: 'de', label: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'AR', name: 'العربية', flag: '🇸🇦' },
] as const

type LocaleCode = 'de' | 'fr' | 'en' | 'ar'

export default function LanguageSwitcher() {
  const locale = useLocale() as LocaleCode
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = locales.find((l) => l.code === locale) ?? locales[0]

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchLocale(newLocale: LocaleCode) {
    setOpen(false)
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="relative" ref={ref}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:border-accent/40 hover:bg-accent-light transition-all text-sm"
        aria-label="Sprache wechseln"
        aria-expanded={open}
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="text-subtle-fg text-xs font-medium">{current.label}</span>
        <svg
          className={`w-3 h-3 text-muted-fg transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
          {locales.map((l) => {
            const isActive = locale === l.code
            return (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent-light text-accent'
                    : 'text-subtle-fg hover:bg-subtle hover:text-foreground'
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <div className="flex-1 text-left">
                  <span className="font-medium">{l.label}</span>
                  <span className="text-muted-fg ml-1.5 text-xs">{l.name}</span>
                </div>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}