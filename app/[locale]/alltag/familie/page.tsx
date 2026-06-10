'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'

const subPages = [
  { key: 'kalender', href: '/alltag/familie/kalender' as const, emoji: '📅' },
  { key: 'aufgaben', href: '/alltag/familie/aufgaben' as const, emoji: '✅' },
  { key: 'notizen', href: '/alltag/familie/notizen' as const, emoji: '📝' },
  { key: 'mitglieder', href: '/alltag/familie/mitglieder' as const, emoji: '👨‍👩‍👧' },
] as const

export default function FamiliePage() {
  const t = useTranslations('familie')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">{t('title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subPages.map(({ key, href, emoji }) => (
          <Link
            key={key}
            href={href}
            className="block p-6 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all bg-white text-center group"
          >
            <div className="text-4xl mb-3">{emoji}</div>
            <h2 className="font-semibold text-gray-800 group-hover:text-emerald-600">
              {t(key)}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
