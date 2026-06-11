'use client'

import { useTranslations, useLocale } from 'next-intl'
import { HajjStep, getMultilingualText } from '@/lib/hajj-data'

interface Props {
  steps: HajjStep[]
  locale?: string
}

export default function HajjStepsGuide({ steps, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('hajj')

  return (
    <ol className="space-y-4" role="list">
      {steps.map((step) => (
        <li key={step.id} className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
            {step.order}
          </div>
          <div className="flex-1 glass-card rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-foreground text-base">
                <span className="text-accent">{t('step_label')} {step.order}: </span>
                <span>{getMultilingualText(step.title, locale)}</span>
              </h3>
              <span className="text-xl text-accent/60 flex-shrink-0" dir="rtl">
                {step.arabic}
              </span>
            </div>
            <p className="text-muted-fg text-sm leading-relaxed">
              {getMultilingualText(step.description, locale)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}