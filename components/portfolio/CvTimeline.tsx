'use client'
import { useTranslations } from 'next-intl'
import { CvEntry } from '@/lib/types'

interface Props {
  entries: CvEntry[]
  locale: string
}

function getLocalizedText(entry: CvEntry, field: 'title' | 'description', locale: string): string | null {
  const key = `${field}_${locale}` as keyof CvEntry
  const value = entry[key] as string | null
  if (value) return value
  return entry[`${field}_de`] as string | null
}

export default function CvTimeline({ entries, locale }: Props) {
  const t = useTranslations('portfolio')

  const experience = entries.filter((e) => e.type === 'experience')
  const education = entries.filter((e) => e.type === 'education')

  const renderSection = (items: CvEntry[], headingKey: string) => (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-6">{t(headingKey)}</h3>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-6">
          {items.map((entry) => {
            const title = getLocalizedText(entry, 'title', locale)
            const description = getLocalizedText(entry, 'description', locale)
            return (
              <div key={entry.id} className="pl-10 relative">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-semibold text-gray-900">{title}</span>
                    <span className="text-xs text-gray-400">
                      {entry.start_year} – {entry.end_year ?? t('cv_present')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-emerald-600">{entry.organization}</p>
                  {description && (
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {renderSection(experience, 'cv_experience')}
      {renderSection(education, 'cv_education')}
    </div>
  )
}
