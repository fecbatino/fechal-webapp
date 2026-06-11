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
        className="flex-1 px-3 py-2 border border-border rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button type="submit" className="px-4 py-2 bg-accent text-white rounded-xl text-sm hover:bg-accent-hover transition-colors">
        +
      </button>
    </form>
  )
}
