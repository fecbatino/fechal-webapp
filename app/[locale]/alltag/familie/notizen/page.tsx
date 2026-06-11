'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useFamilyId } from '@/lib/family-context'
import NotesFeed from '@/components/alltag/familie/NotesFeed'
import NoteForm from '@/components/alltag/familie/NoteForm'
import { FamilyNote } from '@/lib/types'

export default function NotizenPage() {
  const t = useTranslations('familie')
  const { familyId, loading: familyLoading } = useFamilyId()
  const [notes, setNotes] = useState<FamilyNote[]>([])
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

      const { data } = await supabase
        .from('family_notes')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })
      setNotes(data ?? [])
      setLoading(false)

      const channel = supabase
        .channel('family_notes_' + familyId)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'family_notes', filter: `family_id=eq.${familyId}` },
          (payload) => setNotes((prev) => [payload.new as FamilyNote, ...prev])
        )
        .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'family_notes', filter: `family_id=eq.${familyId}` },
          (payload) => setNotes((prev) => prev.filter((n) => n.id !== (payload.old as { id: string }).id))
        )
        .subscribe()

      cleanup = () => { supabase.removeChannel(channel) }
    }

    load()
    return () => { cleanup?.() }
  }, [familyId, familyLoading])

  async function handleAdd(content: string) {
    if (!familyId || !userId) return
    const supabase = createClient()
    await supabase.from('family_notes').insert({ family_id: familyId, content, created_by: userId })
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('family_notes').delete().eq('id', id)
  }

  if (loading) return <div className="p-8 text-center text-muted-fg">…</div>
  if (!familyId) return <div className="max-w-lg mx-auto px-4 py-12 text-center text-muted-fg">{t('family_id_missing')}</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">{t('notizen')}</h1>
      <div className="mb-6"><NoteForm onSubmit={handleAdd} /></div>
      <NotesFeed notes={notes} currentUserId={userId} onDelete={handleDelete} />
    </div>
  )
}
