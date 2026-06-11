'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useFamily } from '@/lib/family-context'
import FamilyCalendar from '@/components/alltag/familie/FamilyCalendar'
import EventForm from '@/components/alltag/familie/EventForm'
import { FamilyEvent } from '@/lib/types'

export default function KalenderPage() {
  const t = useTranslations('familie')
  const { familyId, loading: familyLoading } = useFamily()
  const [events, setEvents] = useState<FamilyEvent[]>([])
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (familyLoading) return
    let cleanup: (() => void) | undefined

    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? '')
      if (!familyId) { setLoading(false); return }

      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('family_events')
        .select('*')
        .eq('family_id', familyId)
        .gte('event_date', today)
        .order('event_date', { ascending: true })
      setEvents(data ?? [])
      setLoading(false)

      const channel = supabase
        .channel('family_events_' + familyId)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'family_events', filter: `family_id=eq.${familyId}` },
          (payload) => setEvents((prev) => [...prev, payload.new as FamilyEvent].sort((a, b) => a.event_date.localeCompare(b.event_date)))
        )
        .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'family_events', filter: `family_id=eq.${familyId}` },
          (payload) => setEvents((prev) => prev.filter((e) => e.id !== (payload.old as { id: string }).id))
        )
        .subscribe()

      cleanup = () => { supabase.removeChannel(channel) }
    }

    load()
    return () => { cleanup?.() }
  }, [familyId, familyLoading])

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

  if (loading) return <div className="p-8 text-center text-muted-fg">…</div>
  if (!familyId) return <div className="max-w-lg mx-auto px-4 py-12 text-center text-muted-fg">{t('family_id_missing')}</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">{t('kalender')}</h1>
      <div className="mb-8"><EventForm onSubmit={handleAdd} /></div>
      <FamilyCalendar events={events} currentUserId={userId} onDelete={handleDelete} />
    </div>
  )
}
