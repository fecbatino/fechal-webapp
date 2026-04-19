'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  onSubmit: (title: string, date: string, description: string) => void
}

export default function EventForm({ onSubmit }: Props) {
  const t = useTranslations('familie')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) return
    onSubmit(title.trim(), date, description.trim())
    setTitle(''); setDate(''); setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 rounded-xl p-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{t('event_title')}</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{t('event_date')}</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{t('event_desc')}</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 transition-colors">
        {t('add_event')}
      </button>
    </form>
  )
}
