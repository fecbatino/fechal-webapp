'use client'

import { useTranslations } from 'next-intl'
import { HajjDua, HajjLocale } from '@/lib/hajj-data'

interface Props {
  duas: HajjDua[]
  locale: string
}

function getText(text: { de: string; fr: string; en: string }, locale: string): string {
  return text[locale as HajjLocale] ?? text.de
}

export default function DuaCollection({ duas, locale }: Props) {
  const t = useTranslations('hajj')

  return (
    <div className="space-y-6">
      {duas.map((dua) => (
        <article key={dua.id} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <p
            className="text-2xl leading-loose text-gray-800 text-right"
            dir="rtl"
            lang="ar"
          >
            {dua.arabic}
          </p>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                {t('dua_transliteration')}
              </span>
              <p className="text-sm text-gray-600 mt-1 italic">{dua.transliteration}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                {t('dua_meaning')}
              </span>
              <p className="text-sm text-gray-700 mt-1">{getText(dua.meaning, locale)}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {t('dua_context')}
              </span>
              <p className="text-sm text-gray-500 mt-1 italic">{getText(dua.context, locale)}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
