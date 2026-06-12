'use client'
import { useTranslations, useLocale } from 'next-intl'
import { CvEntry } from '@/lib/types'
import { getLocalizedCvTitle, getLocalizedCvDescription } from '@/lib/cv-data'

interface Props {
  entries: CvEntry[]
  locale?: string
}

export default function CvTimeline({ entries, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('portfolio')

  const experience = entries
    .filter((e) => e.type === 'experience')
    .sort((a, b) => a.sort_order - b.sort_order)
  const education = entries
    .filter((e) => e.type === 'education')
    .sort((a, b) => a.sort_order - b.sort_order)

  function renderDot(accent = false) {
    return (
      <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
        accent
          ? 'bg-accent border-foreground'
          : 'bg-accent/30 border-accent'
      }`} />
    )
  }

  function renderLine() {
    return (
      <div className="absolute left-[5px] top-4 bottom-0 w-px bg-gradient-to-b from-accent/30 to-transparent" />
    )
  }

  function renderEntry(entry: CvEntry) {
    const title = getLocalizedCvTitle(entry, locale)
    const description = getLocalizedCvDescription(entry, locale)
    const isPresent = entry.end_year === null
    const period = isPresent
      ? `${entry.start_year} – ${t('cv_present')}`
      : `${entry.start_year} – ${entry.end_year}`

    return (
      <li key={entry.id} className="relative pl-8 pb-8 last:pb-0">
        {renderDot(isPresent)}
        {renderLine()}

        <div className="glass-card rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="text-sm text-accent mt-0.5">{entry.organization}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-fg bg-subtle px-2.5 py-1 rounded-full border border-border whitespace-nowrap">
                {period}
              </span>
            </div>
          </div>
          {description && (
            <p className="text-sm text-muted-fg mt-3 leading-relaxed" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              {description}
            </p>
          )}
        </div>
      </li>
    )
  }

  return (
    <div className="space-y-10">
      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
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

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
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