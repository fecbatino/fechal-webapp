'use client'
import { useTranslations, useLocale } from 'next-intl'
import { CvEntry } from '@/lib/types'
import { getLocalizedText } from '@/lib/hajj-data'

interface Props {
  entries: CvEntry[]
  locale?: string
}

export default function CvTimeline({ entries, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('portfolio')

  const experience = entries.filter((e) => e.type === 'experience')
  const education = entries.filter((e) => e.type === 'education')

  function renderEntry(entry: CvEntry) {
    const title = getLocalizedText(entry as unknown as Record<string, unknown>, 'title', locale)
    const description = getLocalizedText(entry as unknown as Record<string, unknown>, 'description', locale)

    return (
      <li key={entry.id} className="relative pl-8 pb-8 last:pb-0">
        {/* Timeline dot */}
        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-teal-500/30 border-2 border-teal-400" />
        {/* Connecting line */}
        <div className="absolute left-[5px] top-4 bottom-0 w-px bg-gradient-to-b from-teal-500/30 to-transparent" />

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="text-sm text-teal-400">{entry.organization}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              {entry.start_year} – {entry.end_year ?? t('cv_present')}
            </span>
          </div>
          {description && (
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">{description}</p>
          )}
        </div>
      </li>
    )
  }

  return (
    <div className="space-y-10">
      {experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {t('cv_experience')}
          </h2>
          <ul role="list" className="space-y-2">
            {experience.map(renderEntry)}
          </ul>
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            {t('cv_education')}
          </h2>
          <ul role="list" className="space-y-2">
            {education.map(renderEntry)}
          </ul>
        </section>
      )}
    </div>
  )
}