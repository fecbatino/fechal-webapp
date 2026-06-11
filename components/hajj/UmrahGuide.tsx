'use client'

import { useTranslations, useLocale } from 'next-intl'
import { UmrahStep, getMultilingualText } from '@/lib/hajj-data'

interface Props {
  steps: UmrahStep[]
  locale?: string
}

export default function UmrahGuide({ steps, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('hajj')

  return (
    <ol className="space-y-4" role="list">
      {steps.map((step) => (
        <li key={step.id} className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            {step.order}
          </div>
          <div className="flex-1 glass-card rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-white text-base">
                <span className="text-emerald-400">{t('step_label')} {step.order}: </span>
                <span>{getMultilingualText(step.title, locale)}</span>
              </h3>
              <span className="text-xl text-emerald-400/60 flex-shrink-0" dir="rtl">
                {step.arabic}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {getMultilingualText(step.description, locale)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}