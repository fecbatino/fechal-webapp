import { createClient } from '@/lib/supabase/client'

export async function getFamilyId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single()

  return data?.family_id ?? null
}
