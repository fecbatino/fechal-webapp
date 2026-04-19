'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  onSubmit: (content: string) => void
}

export default function NoteForm({ onSubmit }: Props) {
  const t = useTranslations('familie')
  const [content, setContent] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    onSubmit(content.trim())
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('add_note')}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 transition-colors">
        +
      </button>
    </form>
  )
}
