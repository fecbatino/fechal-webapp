'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { getFamilyId } from '@/lib/family'
import NotesFeed from '@/components/alltag/familie/NotesFeed'
import NoteForm from '@/components/alltag/familie/NoteForm'
import { FamilyNote } from '@/lib/types'

export default function NotizenPage() {
  const t = useTranslations('familie')
  const [notes, setNotes] = useState<FamilyNote[]>([])
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

      const { data } = await supabase
        .from('family_notes')
        .select('*')
        .eq('family_id', fid)
        .order('created_at', { ascending: false })
      setNotes(data ?? [])
      setLoading(false)

      const channel = supabase
        .channel('family_notes_' + fid)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'family_notes', filter: `family_id=eq.${fid}` },
          (payload) => setNotes((prev) => [payload.new as FamilyNote, ...prev])
        )
        .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'family_notes', filter: `family_id=eq.${fid}` },
          (payload) => setNotes((prev) => prev.filter((n) => n.id !== (payload.old as { id: string }).id))
        )
        .subscribe()

      cleanup = () => { supabase.removeChannel(channel) }
    }

    load()
    return () => { cleanup?.() }
  }, [])

  async function handleAdd(content: string) {
    if (!familyId || !userId) return
    const supabase = createClient()
    await supabase.from('family_notes').insert({ family_id: familyId, content, created_by: userId })
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('family_notes').delete().eq('id', id)
  }

  if (loading) return <div className="p-8 text-center text-gray-400">…</div>
  if (!familyId) return <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-500">{t('family_id_missing')}</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('notizen')}</h1>
      <div className="mb-6"><NoteForm onSubmit={handleAdd} /></div>
      <NotesFeed notes={notes} currentUserId={userId} onDelete={handleDelete} />
    </div>
  )
}
