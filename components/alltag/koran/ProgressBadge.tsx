'use client'
import { useTranslations } from 'next-intl'
import { QuranProgressStatus } from '@/lib/types'

interface Props {
  status: QuranProgressStatus
}

const statusStyles: Record<QuranProgressStatus, string> = {
  not_started: 'bg-gray-100 text-gray-500',
  reading: 'bg-blue-100 text-blue-700',
  memorized: 'bg-green-100 text-green-700',
}

export default function ProgressBadge({ status }: Props) {
  const t = useTranslations('koran')
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[status]}`}>
      {t(`status_${status}`)}
    </span>
  )
}
