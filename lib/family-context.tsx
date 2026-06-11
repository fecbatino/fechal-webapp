'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getFamilyId, getFamily, createFamily, joinFamily, leaveFamily, deleteFamily, regenerateInviteCode, updateMemberRole, removeMember } from '@/lib/family'
import { Family, FamilyRole } from '@/lib/types'

type MemberInfo = {
  id: string
  email: string
  full_name: string | null
  family_role: FamilyRole
}

interface FamilyContextValue {
  familyId: string | null
  family: Family | null
  members: MemberInfo[]
  loading: boolean
  refresh: () => Promise<void>
  create: (name: string) => Promise<{ ok: boolean; error?: string }>
  join: (code: string) => Promise<{ ok: boolean; error?: string }>
  leave: () => Promise<{ ok: boolean; error?: string }>
  disband: () => Promise<{ ok: boolean; error?: string }>
  regenerateCode: () => Promise<{ ok: boolean; code?: string; error?: string }>
  updateRole: (memberId: string, role: FamilyRole) => Promise<{ ok: boolean; error?: string }>
  remove: (memberId: string) => Promise<{ ok: boolean; error?: string }>
}

const FamilyContext = createContext<FamilyContextValue>({
  familyId: null,
  family: null,
  members: [],
  loading: true,
  refresh: async () => {},
  create: async () => ({ ok: false }),
  join: async () => ({ ok: false }),
  leave: async () => ({ ok: false }),
  disband: async () => ({ ok: false }),
  regenerateCode: async () => ({ ok: false }),
  updateRole: async () => ({ ok: false }),
  remove: async () => ({ ok: false }),
})

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [family, setFamily] = useState<Family | null>(null)
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const id = await getFamilyId()
    setFamilyId(id)

    if (id) {
      const [famResult, membersResult] = await Promise.all([
        getFamily(),
        getMembers(id),
      ])
      setFamily(famResult)
      setMembers(membersResult)
    } else {
      setFamily(null)
      setMembers([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const create = useCallback(async (name: string) => {
    const result = await createFamily(name)
    if (result.ok) await load()
    return result
  }, [load])

  const join = useCallback(async (code: string) => {
    const result = await joinFamily(code)
    if (result.ok) await load()
    return result
  }, [load])

  const leave = useCallback(async () => {
    const result = await leaveFamily()
    if (result.ok) await load()
    return result
  }, [load])

  const disband = useCallback(async () => {
    const result = await deleteFamily()
    if (result.ok) await load()
    return result
  }, [load])

  const regenerateCode = useCallback(async () => {
    const result = await regenerateInviteCode()
    if (result.ok) await load()
    return result
  }, [load])

  const updateRole = useCallback(async (memberId: string, role: FamilyRole) => {
    const result = await updateMemberRole(memberId, role)
    if (result.ok) await load()
    return result
  }, [load])

  const remove = useCallback(async (memberId: string) => {
    const result = await removeMember(memberId)
    if (result.ok) await load()
    return result
  }, [load])

  return (
    <FamilyContext.Provider value={{
      familyId, family, members, loading, refresh: load,
      create, join, leave, disband, regenerateCode, updateRole, remove,
    }}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamily() {
  return useContext(FamilyContext)
}

async function getMembers(familyId: string): Promise<MemberInfo[]> {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, family_role')
    .eq('family_id', familyId)
  return (data ?? []) as MemberInfo[]
}