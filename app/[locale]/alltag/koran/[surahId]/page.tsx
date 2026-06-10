'use client'
import { use, useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { fetchSurahWithTranslation, fetchSurahMeta } from '@/lib/quran-api'
import { applyTajweed, TajweedChar, TAJWEED_COLORS } from '@/lib/tajweed'
import { Ayah, QuranProgressStatus } from '@/lib/types'
import AyahDisplay from '@/components/alltag/koran/AyahDisplay'
import { Link } from '@/lib/navigation'

interface AyahWithTajweed {
  ayah: Ayah
  translation: string
  tajweedChars: TajweedChar[]
}

interface Props {
  params: Promise<{ surahId: string }>
}

export default function SurahReaderPage({ params }: Props) {
  const { surahId } = use(params)
  const t = useTranslations('koran')
  const locale = useLocale()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ayahs, setAyahs] = useState<AyahWithTajweed[]>([])
  const [surahName, setSurahName] = useState('')
  const [surahEnglishName, setSurahEnglishName] = useState('')
  const [currentStatus, setCurrentStatus] = useState<QuranProgressStatus>('not_started')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const surahNumber = parseInt(surahId, 10)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setUserId(user.id)

        const [surahData, progressResult, surahMeta] = await Promise.all([
          fetchSurahWithTranslation(surahNumber, locale),
          user
            ? supabase.from('quran_progress').select('*').eq('user_id', user.id).eq('surah_number', surahNumber).maybeSingle()
            : Promise.resolve({ data: null, error: null }),
          fetchSurahMeta(surahNumber),
        ])

        const combined: AyahWithTajweed[] = surahData.arabic.map((arabicAyah, i) => ({
          ayah: arabicAyah,
          translation: surahData.translation[i]?.text ?? '',
          tajweedChars: applyTajweed(arabicAyah.text),
        }))
        setAyahs(combined)
        setSurahName(surahMeta.name)
        setSurahEnglishName(surahMeta.englishName)

        if (progressResult.data) {
          setCurrentStatus(progressResult.data.status as QuranProgressStatus)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [surahNumber, locale])

  async function markProgress(status: QuranProgressStatus) {
    if (!userId) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { error: upsertError } = await supabase.from('quran_progress').upsert({
        user_id: userId,
        surah_number: surahNumber,
        status,
        updated_at: new Date().toISOString(),
      })
      if (upsertError) throw upsertError
      setCurrentStatus(status)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-red-500">Invalid surah</div>
  }

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
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        {surahNumber > 1 ? (
          <Link
            href={`/alltag/koran/${surahNumber - 1}`}
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← {t('prev_surah')}
          </Link>
        ) : <span />}
        <Link href="/alltag/koran" className="text-sm text-gray-400 hover:text-gray-600">
          {t('surah_list')}
        </Link>
        {surahNumber < 114 ? (
          <Link
            href={`/alltag/koran/${surahNumber + 1}`}
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {t('next_surah')} →
          </Link>
        ) : <span />}
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{surahEnglishName}</h1>
        <p className="text-gray-400 text-sm">{surahName} · {ayahs.length} {t('ayahs')}</p>
      </div>

      <details className="mb-6 bg-gray-50 rounded-xl p-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-600">{t('tajweed_legend')}</summary>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <span><span style={{ color: TAJWEED_COLORS.qalqalah }}>■</span> Qalqalah</span>
          <span><span style={{ color: TAJWEED_COLORS.madd }}>■</span> Madd</span>
          <span><span style={{ color: TAJWEED_COLORS.ghunna }}>■</span> Ghunna</span>
          <span><span style={{ color: TAJWEED_COLORS.idgham }}>■</span> Idgham</span>
        </div>
      </details>

      {userId && (
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => markProgress('reading')}
            disabled={saving || currentStatus === 'reading'}
            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 disabled:opacity-50 transition-colors"
          >
            {t('mark_reading')}
          </button>
          <button
            onClick={() => markProgress('memorized')}
            disabled={saving || currentStatus === 'memorized'}
            className="px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 disabled:opacity-50 transition-colors"
          >
            {t('mark_memorized')}
          </button>
          {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {ayahs.map(({ ayah, translation, tajweedChars }) => (
          <AyahDisplay key={ayah.number} ayah={ayah} translation={translation} tajweedChars={tajweedChars} />
        ))}
      </div>
    </div>
  )
}
