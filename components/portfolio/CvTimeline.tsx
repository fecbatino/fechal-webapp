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
      <li key={entry.id} className="border-l-2 border-emerald-200 pl-4 pb-6 last:pb-0">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{entry.organization}</p>
          <p className="text-xs text-gray-400">
            {entry.start_year} – {entry.end_year ?? t('cv_present')}
          </p>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </li>
    )
  }

  return (
    <div className="space-y-10">
      {experience.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {t('cv_experience')}
          </h2>
          <ul role="list" className="space-y-4">
            {experience.map(renderEntry)}
          </ul>
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {t('cv_education')}
          </h2>
          <ul role="list" className="space-y-4">
            {education.map(renderEntry)}
          </ul>
        </section>
      )}
    </div>
  )
}