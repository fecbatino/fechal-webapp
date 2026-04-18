'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'

const sections = [
  { key: 'familie', href: '/familie' as const, emoji: '👨‍👩‍👧‍👦' },
  { key: 'arabisch', href: '/arabisch' as const, emoji: '🔤' },
  { key: 'koran', href: '/koran' as const, emoji: '📖' },
] as const

export default function AlltagPage() {
  const t = useTranslations('alltag')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-10">{t('subtitle')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
    </div>
  )
}
