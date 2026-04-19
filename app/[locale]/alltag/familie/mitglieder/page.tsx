'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getFamilyId } from '@/lib/family'
import { Profile } from '@/lib/types'
import FamilyMembers from '@/components/alltag/familie/FamilyMembers'

export default function MitgliederPage() {
  const [members, setMembers] = useState<Pick<Profile, 'id' | 'email' | 'full_name' | 'family_role'>[]>([])
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const fid = await getFamilyId()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? '')
      if (!fid) { setLoading(false); return }

      const { data } = await supabase
        .from('profiles')
        .select('id, email, full_name, family_role')
        .eq('family_id', fid)
      setMembers(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-400">…</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Familienmitglieder</h1>
      <FamilyMembers members={members} currentUserId={userId} />
    </div>
  )
}
