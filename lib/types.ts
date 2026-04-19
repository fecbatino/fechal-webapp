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

export interface ArabicCard {
  id: string
  arabic: string
  transliteration: string
  meaning_de: string
  meaning_fr: string
  meaning_en: string
  category: string
  created_at: string
}

export interface UserCardProgress {
  id: string
  user_id: string
  card_id: string
  ease_factor: number
  repetitions: number
  interval_days: number
  next_due: string // ISO date "YYYY-MM-DD"
  updated_at: string
}

export type QuranProgressStatus = 'not_started' | 'reading' | 'memorized'

export interface QuranProgress {
  id: string
  user_id: string
  surah_number: number
  status: QuranProgressStatus
  updated_at: string
}

export interface Surah {
  number: number
  name: string                    // Arabic name from API
  englishName: string             // transliteration
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface Ayah {
  number: number
  numberInSurah: number
  text: string
}
