'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArabicCard, UserCardProgress } from '@/lib/types'
import { calculateSM2 } from '@/lib/sm2'
import { createClient } from '@/lib/supabase/client'
import Flashcard from './Flashcard'

interface Props {
  cards: ArabicCard[]
  progressMap: Record<string, UserCardProgress>
  userId: string
  locale: string
  onComplete: () => void
}

export default function FlashcardDeck({ cards, progressMap, userId, locale, onComplete }: Props) {
  const t = useTranslations('arabisch')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [saving, setSaving] = useState(false)

  const currentCard = cards[currentIndex]

  async function handleRate(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    if (!currentCard) return
    setSaving(true)
    const existing = progressMap[currentCard.id]
    const result = calculateSM2({
      easeFactor: existing?.ease_factor ?? 2.5,
      repetitions: existing?.repetitions ?? 0,
      interval: existing?.interval_days ?? 1,
      quality,
    })
    const supabase = createClient()
    await supabase.from('user_card_progress').upsert({
      user_id: userId,
      card_id: currentCard.id,
      ease_factor: result.easeFactor,
      repetitions: result.repetitions,
      interval_days: result.interval,
      next_due: result.nextDue.toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    const nextIndex = currentIndex + 1
    if (nextIndex >= cards.length) {
      onComplete()
    } else {
      setCurrentIndex(nextIndex)
    }
  }

  if (!currentCard) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{t('cards_due')}</span>
        <span className="font-semibold text-gray-700">{currentIndex + 1} / {cards.length}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(currentIndex / cards.length) * 100}%` }} />
      </div>
      {saving ? (
        <div className="text-center text-gray-400 py-8">...</div>
      ) : (
        <Flashcard key={currentCard.id} card={currentCard} locale={locale} onRate={handleRate} />
      )}
    </div>
  )
}
