'use client'
import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { ArabicCard, UserCardProgress } from '@/lib/types'
import FlashcardDeck from '@/components/alltag/arabisch/FlashcardDeck'

export default function ArabischPage() {
  const t = useTranslations('arabisch')
  const locale = useLocale()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dueCards, setDueCards] = useState<ArabicCard[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, UserCardProgress>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionDone, setSessionDone] = useState(false)

  useEffect(() => {
    async function loadCards() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setError('Not authenticated'); setLoading(false); return }
        setUserId(user.id)

        const today = new Date().toISOString().split('T')[0]

        const [cardsResult, progressResult] = await Promise.all([
          supabase.from('arabic_cards').select('*'),
          supabase.from('user_card_progress').select('*').eq('user_id', user.id).lte('next_due', today),
        ])

        if (cardsResult.error) throw cardsResult.error

        const pMap: Record<string, UserCardProgress> = {}
        const progressCardIds = new Set<string>()
        for (const p of (progressResult.data ?? [])) {
          pMap[p.card_id] = p
          progressCardIds.add(p.card_id)
        }

        const due = (cardsResult.data ?? []).filter(
          (card: ArabicCard) => !progressCardIds.has(card.id) || pMap[card.id]?.next_due <= today
        )

        setProgressMap(pMap)
        setDueCards(due)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    loadCards()
  }, [])

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center text-gray-400">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  if (error) {
    return <div className="max-w-xl mx-auto px-4 py-12 text-center text-red-500">{error}</div>
  }

  if (sessionDone || dueCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('cards_done')}</h1>
        <p className="text-gray-500">{t('no_cards_due')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{t('title')}</h1>
        <p className="text-gray-500">{t('subtitle')}</p>
      </div>
      {userId && (
        <FlashcardDeck
          cards={dueCards}
          progressMap={progressMap}
          userId={userId}
          locale={locale}
          onComplete={() => setSessionDone(true)}
        />
      )}
    </div>
  )
}
