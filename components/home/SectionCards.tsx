'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'

const sections = [
  { key: 'alltag', href: '/alltag', emoji: '🏠' },
  { key: 'portfolio', href: '/portfolio', emoji: '💼' },
  { key: 'hajj', href: '/hajj-umrah', emoji: '🕋' },
  { key: 'vereine', href: '/vereine', emoji: '🤝' },
] as const

export default function SectionCards() {
  const t = useTranslations('sections')

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map(({ key, href, emoji }) => (
          <Link
            key={key}
            href={href}
            className="block p-6 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all bg-white text-center group"
          >
            <div className="text-4xl mb-3">{emoji}</div>
            <h2 className="font-semibold text-gray-800 group-hover:text-emerald-600">
              {t(key)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t(`${key}_desc`)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
