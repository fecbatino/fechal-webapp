'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { fetchSurahs } from '@/lib/quran-api'
import { Surah, QuranProgress } from '@/lib/types'
import SurahList from '@/components/alltag/koran/SurahList'

export default function KoranPage() {
  const t = useTranslations('koran')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [progressMap, setProgressMap] = useState<Record<number, QuranProgress>>({})

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const [surahData, progressResult] = await Promise.all([
          fetchSurahs(),
          user
            ? supabase.from('quran_progress').select('*').eq('user_id', user.id)
            : Promise.resolve({ data: [], error: null }),
        ])

        setSurahs(surahData)
        const pMap: Record<number, QuranProgress> = {}
        for (const p of (progressResult.data ?? [])) {
          pMap[p.surah_number] = p
        }
        setProgressMap(pMap)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  if (error) {
    return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-red-500">{error}</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">{t('title')}</h1>
        <p className="text-muted-fg">{t('subtitle')}</p>
      </div>
      <h2 className="text-lg font-semibold text-muted mb-4">{t('surah_list')}</h2>
      <SurahList surahs={surahs} progressMap={progressMap} />
    </div>
  )
}
