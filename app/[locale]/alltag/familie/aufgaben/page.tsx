'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { getFamilyId } from '@/lib/family'
import TaskList from '@/components/alltag/familie/TaskList'
import { FamilyTask } from '@/lib/types'

export default function AufgabenPage() {
  const t = useTranslations('familie')
  const [tasks, setTasks] = useState<FamilyTask[]>([])
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const fid = await getFamilyId()
      setFamilyId(fid)
      if (!fid) { setLoading(false); return }
      const supabase = createClient()
      const { data } = await supabase
        .from('family_tasks')
        .select('*')
        .eq('family_id', fid)
        .order('created_at', { ascending: false })
      setTasks(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleAdd(title: string, category: 'task' | 'shopping') {
    if (!familyId) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('family_tasks')
      .insert({ family_id: familyId, title, category, created_by: user.id })
      .select()
      .single()
    if (data) setTasks((prev) => [data, ...prev])
  }

  async function handleToggle(id: string, completed: boolean) {
    const supabase = createClient()
    await supabase.from('family_tasks').update({ completed }).eq('id', id)
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('family_tasks').delete().eq('id', id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  if (loading) return <div className="p-8 text-center text-gray-400">…</div>

  if (!familyId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-500">
        {t('family_id_missing')}
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('aufgaben')}</h1>
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} onAdd={handleAdd} />
    </div>
  )
}
