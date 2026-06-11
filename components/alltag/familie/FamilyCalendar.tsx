'use client'
import { useTranslations } from 'next-intl'
import { FamilyEvent } from '@/lib/types'

interface Props {
  events: FamilyEvent[]
  currentUserId: string
  onDelete: (id: string) => void
}

export default function FamilyCalendar({ events, currentUserId, onDelete }: Props) {
  const t = useTranslations('familie')

  if (events.length === 0) {
    return <p className="text-muted-fg text-sm text-center py-8">{t('no_events')}</p>
  }

  const sorted = [...events].sort((a, b) => a.event_date.localeCompare(b.event_date))

  return (
    <ul className="space-y-3">
      {sorted.map((event) => (
        <li key={event.id} className="bg-background border border-border rounded-xl p-4 flex items-start gap-4">
          <div className="min-w-[80px] text-center">
            <div className="text-xs font-mono text-emerald-700 bg-emerald-50 rounded-lg px-2 py-1">
              {event.event_date}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{event.title}</p>
            {event.description && <p className="text-sm text-muted-fg mt-1">{event.description}</p>}
          </div>
          {event.created_by === currentUserId && (
            <button onClick={() => onDelete(event.id)} className="text-muted-fg hover:text-red-500 text-xs" aria-label={t('delete')}>
              ✕
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
