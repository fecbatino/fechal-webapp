'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArabicCard } from '@/lib/types'

interface Props {
  card: ArabicCard
  locale: string
  onRate: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void
}

function getTranslation(card: ArabicCard, locale: string): string {
  if (locale === 'fr') return card.meaning_fr
  if (locale === 'en') return card.meaning_en
  return card.meaning_de
}

export default function Flashcard({ card, locale, onRate }: Props) {
  const t = useTranslations('arabisch')
  const [revealed, setRevealed] = useState(false)

  function handleRate(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    setRevealed(false)
    onRate(quality)
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center gap-6 min-h-[320px]">
      <div className="text-center flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-5xl font-bold text-gray-900 leading-relaxed" dir="rtl" lang="ar">
          {card.arabic}
        </p>
        <p className="text-lg text-muted-fg italic">{card.transliteration}</p>
        <span className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 font-medium">
          {card.category}
        </span>
      </div>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
        >
          {t('show_answer')}
        </button>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <p className="text-center text-xl font-medium text-foreground">
            {getTranslation(card, locale)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button onClick={() => handleRate(1)} className="py-3 sm:py-2 rounded-xl bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200 transition-colors">{t('quality_again')}</button>
            <button onClick={() => handleRate(3)} className="py-3 sm:py-2 rounded-xl bg-orange-100 text-orange-700 text-sm font-semibold hover:bg-orange-200 transition-colors">{t('quality_hard')}</button>
            <button onClick={() => handleRate(4)} className="py-3 sm:py-2 rounded-xl bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 transition-colors">{t('quality_good')}</button>
            <button onClick={() => handleRate(5)} className="py-3 sm:py-2 rounded-xl bg-green-100 text-green-700 text-sm font-semibold hover:bg-green-200 transition-colors">{t('quality_easy')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
