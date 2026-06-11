'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { Surah, QuranProgress } from '@/lib/types'
import ProgressBadge from './ProgressBadge'

interface Props {
  surahs: Surah[]
  progressMap: Record<number, QuranProgress>
}

export default function SurahList({ surahs, progressMap }: Props) {
  const t = useTranslations('koran')

  return (
    <div className="space-y-2">
      {surahs.map((surah) => {
        const progress = progressMap[surah.number]
        return (
          <Link
            key={surah.number}
            href={`/koran/${surah.number}` as `/koran/${string}`}
            className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border hover:border-emerald-400 hover:shadow-sm transition-all group"
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center border border-emerald-200">
              {surah.number}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground group-hover:text-accent">
                  {surah.englishName}
                </span>
                {progress && <ProgressBadge status={progress.status} />}
              </div>
              <p className="text-sm text-muted-fg">
                {surah.numberOfAyahs} {t('ayahs')}
              </p>
            </div>
            <span className="text-xl text-muted font-medium" dir="rtl" lang="ar">
              {surah.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
