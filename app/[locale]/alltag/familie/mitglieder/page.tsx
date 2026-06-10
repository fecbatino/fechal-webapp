'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useFamilyId } from '@/lib/family-context'
import { Profile } from '@/lib/types'
import FamilyMembers from '@/components/alltag/familie/FamilyMembers'

export default function MitgliederPage() {
  const t = useTranslations('familie')
  const { familyId, loading: familyLoading } = useFamilyId()
  const [members, setMembers] = useState<Pick<Profile, 'id' | 'email' | 'full_name' | 'family_role'>[]>([])
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (familyLoading) return
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? '')
      if (!familyId) { setLoading(false); return }

      const { data } = await supabase
        .from('profiles')
        .select('id, email, full_name, family_role')
        .eq('family_id', familyId)
      setMembers(data ?? [])
      setLoading(false)
    }
    load()
  }, [familyId, familyLoading])

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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('mitglieder')}</h1>
      <FamilyMembers members={members} currentUserId={userId} />
    </div>
  )
}
