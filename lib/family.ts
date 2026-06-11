import { createClient } from '@/lib/supabase/client'
import { Family, FamilyRole } from './types'

/** Generate a random 6-character invite code (uppercase alphanumeric) */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no I/O/0/1 to avoid confusion
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

/** Get the current user's family_id from profiles */
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

/** Get full family info (name + invite_code) */
export async function getFamily(): Promise<Family | null> {
  const supabase = createClient()
  const familyId = await getFamilyId()
  if (!familyId) return null

  const { data } = await supabase
    .from('families')
    .select('*')
    .eq('id', familyId)
    .single()

  return data
}

/** Create a new family and assign the current user as 'parent' */
export async function createFamily(name: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Check if user already has a family
  const existingId = await getFamilyId()
  if (existingId) return { ok: false, error: 'Bereits einer Familie zugeordnet' }

  let inviteCode: string
  let attempts = 0
  // Ensure unique invite code
  while (true) {
    inviteCode = generateInviteCode()
    const { data: existing } = await supabase
      .from('families')
      .select('id')
      .eq('invite_code', inviteCode)
      .maybeSingle()
    if (!existing) break
    attempts++
    if (attempts > 10) return { ok: false, error: 'Konnte keinen eindeutigen Code generieren' }
  }

  // Create family
  const { data: family, error: createError } = await supabase
    .from('families')
    .insert({ name, invite_code: inviteCode, created_by: user.id })
    .select()
    .single()

  if (createError || !family) {
    return { ok: false, error: createError?.message ?? 'Fehler beim Erstellen' }
  }

  // Assign user to family as parent
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ family_id: family.id, family_role: 'parent' })
    .eq('id', user.id)

  if (updateError) {
    // Rollback: delete the family
    await supabase.from('families').delete().eq('id', family.id)
    return { ok: false, error: updateError.message }
  }

  return { ok: true }
}

/** Join a family via invite code */
export async function joinFamily(inviteCode: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Check if user already has a family
  const existingId = await getFamilyId()
  if (existingId) return { ok: false, error: 'Bereits einer Familie zugeordnet' }

  // Find family by invite code
  const { data: family, error: searchError } = await supabase
    .from('families')
    .select('id')
    .eq('invite_code', inviteCode.toUpperCase().trim())
    .maybeSingle()

  if (searchError || !family) {
    return { ok: false, error: 'Ungültiger Einladungscode' }
  }

  // Assign user to family as 'member'
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ family_id: family.id, family_role: 'member' })
    .eq('id', user.id)

  if (updateError) {
    return { ok: false, error: updateError.message }
  }

  return { ok: true }
}

/** Leave a family (delete user's family_id). Parents must reassign or delete family first */
export async function leaveFamily(): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id, family_role')
    .eq('id', user.id)
    .single()

  if (!profile?.family_id) return { ok: false, error: 'Keiner Familie zugeordnet' }

  // Parents cannot leave – they must delete the family
  if (profile.family_role === 'parent') {
    return { ok: false, error: 'Elternteile können die Familie nicht verlassen. Lösche stattdessen die Familie.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ family_id: null, family_role: 'member' })
    .eq('id', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/** Delete the entire family (parent only) */
export async function deleteFamily(): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id, family_role')
    .eq('id', user.id)
    .single()

  if (!profile?.family_id) return { ok: false, error: 'Keiner Familie zugeordnet' }
  if (profile.family_role !== 'parent') return { ok: false, error: 'Nur Eltern können die Familie löschen' }

  const familyId = profile.family_id

  // Remove all members' family_id
  await supabase
    .from('profiles')
    .update({ family_id: null, family_role: 'member' })
    .eq('family_id', familyId)

  // Delete family data
  await supabase.from('family_events').delete().eq('family_id', familyId)
  await supabase.from('family_tasks').delete().eq('family_id', familyId)
  await supabase.from('family_notes').delete().eq('family_id', familyId)

  // Delete the family itself
  const { error } = await supabase.from('families').delete().eq('id', familyId)
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}

/** Update a member's role (parent only) */
export async function updateMemberRole(
  memberId: string,
  role: FamilyRole
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ family_role: role })
    .eq('id', memberId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/** Remove a member from the family (parent only) */
export async function removeMember(
  memberId: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ family_id: null, family_role: 'member' })
    .eq('id', memberId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/** Regenerate invite code (parent only) */
export async function regenerateInviteCode(): Promise<{ ok: boolean; code?: string; error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id, family_role')
    .eq('id', user.id)
    .single()

  if (!profile?.family_id) return { ok: false, error: 'Keiner Familie zugeordnet' }
  if (profile.family_role !== 'parent') return { ok: false, error: 'Nur Eltern können den Code erneuern' }

  const newCode = generateInviteCode()
  const { error } = await supabase
    .from('families')
    .update({ invite_code: newCode })
    .eq('id', profile.family_id)
  if (error) return { ok: false, error: error.message }

  return { ok: true, code: newCode }
}