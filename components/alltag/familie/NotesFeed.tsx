'use client'
import { useTranslations } from 'next-intl'
import { FamilyNote } from '@/lib/types'

interface Props {
  notes: FamilyNote[]
  currentUserId: string
  onDelete: (id: string) => void
}

export default function NotesFeed({ notes, currentUserId, onDelete }: Props) {
  const t = useTranslations('familie')

  if (notes.length === 0) {
    return <p className="text-muted-fg text-sm text-center py-8">{t('no_notes')}</p>
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.id} className="bg-background border border-border rounded-xl p-4 flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-foreground">{note.content}</p>
            <time className="text-xs text-muted-fg mt-1 block">
              {new Date(note.created_at).toLocaleString()}
            </time>
          </div>
          {note.created_by === currentUserId && (
            <button
              onClick={() => onDelete(note.id)}
              className="text-muted-fg hover:text-red-500 text-xs"
              aria-label={t('delete')}
            >
              ✕
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
