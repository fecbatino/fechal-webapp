export type Role = 'guest' | 'user' | 'admin'
export type FamilyRole = 'parent' | 'child' | 'member'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: Role
  preferred_locale: 'de' | 'fr' | 'en'
  created_at: string
  family_id: string | null
  family_role: FamilyRole
}

export interface FamilyEvent {
  id: string
  family_id: string
  title: string
  event_date: string   // ISO date string: "YYYY-MM-DD"
  description: string | null
  created_by: string
  created_at: string
}

export interface FamilyTask {
  id: string
  family_id: string
  title: string
  completed: boolean
  category: 'task' | 'shopping'
  created_by: string
  created_at: string
}

export interface FamilyNote {
  id: string
  family_id: string
  content: string
  created_by: string
  created_at: string
}
