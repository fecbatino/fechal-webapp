export type Role = 'guest' | 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: Role
  preferred_locale: 'de' | 'fr' | 'en'
  created_at: string
}
