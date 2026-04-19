import { Surah, Ayah } from '@/lib/types'

const BASE = 'https://api.alquran.cloud/v1'

export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE}/surah`, { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error(`Failed to fetch surahs: ${res.status}`)
  const json = await res.json()
  return json.data as Surah[]
}

const TRANSLATION_EDITIONS: Record<string, string> = {
  de: 'de.bubenheim',
  fr: 'fr.hamidullah',
  en: 'en.sahih',
}

export async function fetchSurahMeta(surahNumber: number): Promise<{ name: string; englishName: string }> {
  const res = await fetch(`${BASE}/surah/${surahNumber}`)
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahNumber} meta`)
  const json = await res.json()
  return { name: json.data.name, englishName: json.data.englishName }
}

export async function fetchSurahWithTranslation(
  surahNumber: number,
  locale: string
): Promise<{ arabic: Ayah[]; translation: Ayah[] }> {
  const edition = TRANSLATION_EDITIONS[locale] ?? 'en.sahih'
  const res = await fetch(
    `${BASE}/surah/${surahNumber}/editions/quran-uthmani,${edition}`,
    { next: { revalidate: 86400 } }
  )
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahNumber}: ${res.status}`)
  const json = await res.json()
  return {
    arabic: json.data[0].ayahs as Ayah[],
    translation: json.data[1].ayahs as Ayah[],
  }
}
