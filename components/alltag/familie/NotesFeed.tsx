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
    return <p className="text-gray-400 text-sm text-center py-8">{t('no_notes')}</p>
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-gray-800">{note.content}</p>
            <time className="text-xs text-gray-400 mt-1 block">
              {new Date(note.created_at).toLocaleString()}
            </time>
          </div>
          {note.created_by === currentUserId && (
            <button
              onClick={() => onDelete(note.id)}
              className="text-gray-400 hover:text-red-500 text-xs"
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
