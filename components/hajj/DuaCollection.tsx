'use client'

import { useTranslations, useLocale } from 'next-intl'
import { HajjDua, getMultilingualText } from '@/lib/hajj-data'

interface Props {
  duas: HajjDua[]
  locale?: string
}

export default function DuaCollection({ duas, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('hajj')

  return (
    <div className="space-y-5">
      {duas.map((dua) => (
        <article key={dua.id} className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white" aria-label={`${t('dua_transliteration')}: ${dua.transliteration}`}>
            {dua.transliteration}
          </h3>
          <p
            className="text-2xl leading-loose text-teal-300 text-right"
            dir="rtl"
            lang="ar"
          >
            {dua.arabic}
          </p>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <div>
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wide">
                {t('dua_meaning')}
              </span>
              <p className="text-sm text-gray-300 mt-1">{getMultilingualText(dua.meaning, locale)}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t('dua_context')}
              </span>
              <p className="text-sm text-gray-400 mt-1 italic">{getMultilingualText(dua.context, locale)}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}