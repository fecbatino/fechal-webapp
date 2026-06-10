'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { getFamilyId } from '@/lib/family'

interface FamilyContextValue {
  familyId: string | null
  loading: boolean
  refresh: () => Promise<void>
}

const FamilyContext = createContext<FamilyContextValue>({
  familyId: null,
  loading: true,
  refresh: async () => {},
})

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const id = await getFamilyId()
    setFamilyId(id)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <FamilyContext.Provider value={{ familyId, loading, refresh: load }}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamilyId() {
  return useContext(FamilyContext)
}
