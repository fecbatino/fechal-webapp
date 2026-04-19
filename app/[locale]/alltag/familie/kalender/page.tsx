'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { getFamilyId } from '@/lib/family'
import FamilyCalendar from '@/components/alltag/familie/FamilyCalendar'
import EventForm from '@/components/alltag/familie/EventForm'
import { FamilyEvent } from '@/lib/types'

export default function KalenderPage() {
  const t = useTranslations('familie')
  const [events, setEvents] = useState<FamilyEvent[]>([])
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cleanup: (() => void) | undefined

    async function load() {
      const supabase = createClient()
      const [fid, { data: { user } }] = await Promise.all([
        getFamilyId(),
        supabase.auth.getUser(),
      ])
      setFamilyId(fid)
      setUserId(user?.id ?? '')
      if (!fid) { setLoading(false); return }

      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('family_events')
        .select('*')
        .eq('family_id', fid)
        .gte('event_date', today)
        .order('event_date', { ascending: true })
      setEvents(data ?? [])
      setLoading(false)

      const channel = supabase
        .channel('family_events_' + fid)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'family_events', filter: `family_id=eq.${fid}` },
          (payload) => setEvents((prev) => [...prev, payload.new as FamilyEvent].sort((a, b) => a.event_date.localeCompare(b.event_date)))
        )
        .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'family_events', filter: `family_id=eq.${fid}` },
          (payload) => setEvents((prev) => prev.filter((e) => e.id !== (payload.old as { id: string }).id))
        )
        .subscribe()

      cleanup = () => { supabase.removeChannel(channel) }
    }

    load()
    return () => { cleanup?.() }
  }, [])

  async function handleAdd(title: string, date: string, description: string) {
    if (!familyId || !userId) return
    const supabase = createClient()
    await supabase.from('family_events').insert({
      family_id: familyId, title, event_date: date,
      description: description || null, created_by: userId,
    })
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('family_events').delete().eq('id', id)
  }

  if (loading) return <div className="p-8 text-center text-gray-400">…</div>
  if (!familyId) return <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-500">{t('family_id_missing')}</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('kalender')}</h1>
      <div className="mb-8"><EventForm onSubmit={handleAdd} /></div>
      <FamilyCalendar events={events} currentUserId={userId} onDelete={handleDelete} />
    </div>
  )
}
