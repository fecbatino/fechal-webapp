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
    <ol className="space-y-6" role="list">
      {steps.map((step) => (
        <li key={step.id} className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {step.order}
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-gray-900 text-base">
                <span>{t('step_label')} {step.order}: </span>
                <span>{getMultilingualText(step.title, locale)}</span>
              </h3>
              <span className="text-xl text-gray-600 flex-shrink-0" dir="rtl">
                {step.arabic}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {getMultilingualText(step.description, locale)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
