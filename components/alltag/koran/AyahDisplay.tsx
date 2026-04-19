'use client'
import { Ayah } from '@/lib/types'
import { TajweedChar, TAJWEED_COLORS } from '@/lib/tajweed'

interface Props {
  ayah: Ayah
  translation: string
  tajweedChars: TajweedChar[]
}

export default function AyahDisplay({ ayah, translation, tajweedChars }: Props) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center border border-emerald-200 mt-1">
          {ayah.numberInSurah}
        </span>
        <div className="flex-1">
          <p
            className="text-2xl leading-loose text-right mb-3"
            dir="rtl"
            lang="ar"
            role="region"
            aria-label="arabic"
          >
            {tajweedChars.map((tc, i) => (
              <span key={i} style={{ color: TAJWEED_COLORS[tc.rule] }}>
                {tc.char}
              </span>
            ))}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">{translation}</p>
        </div>
      </div>
    </div>
  )
}
