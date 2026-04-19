import { render, screen } from '@testing-library/react'
import SurahList from '@/components/alltag/koran/SurahList'
import { Surah, QuranProgress } from '@/lib/types'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

jest.mock('@/lib/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockSurahs: Surah[] = [
  {
    number: 1,
    name: 'سُورَةُ ٱلْفَاتِحَةِ',
    englishName: 'Al-Faatiha',
    englishNameTranslation: 'The Opening',
    numberOfAyahs: 7,
    revelationType: 'Meccan',
  },
  {
    number: 2,
    name: 'سُورَةُ ٱلْبَقَرَةِ',
    englishName: 'Al-Baqara',
    englishNameTranslation: 'The Cow',
    numberOfAyahs: 286,
    revelationType: 'Medinan',
  },
]

const mockProgressMap: Record<number, QuranProgress> = {
  1: {
    id: 'prog-1',
    user_id: 'user-1',
    surah_number: 1,
    status: 'memorized',
    updated_at: '2026-04-01T00:00:00Z',
  },
}

describe('SurahList', () => {
  it('renders surah english names', () => {
    render(<SurahList surahs={mockSurahs} progressMap={mockProgressMap} />)
    expect(screen.getByText('Al-Faatiha')).toBeInTheDocument()
    expect(screen.getByText('Al-Baqara')).toBeInTheDocument()
  })

  it('renders surah numbers', () => {
    render(<SurahList surahs={mockSurahs} progressMap={mockProgressMap} />)
    // Each number badge has only digits — use getAllByText to avoid ambiguity
    const ones = screen.getAllByText('1')
    expect(ones.length).toBeGreaterThanOrEqual(1)
    const twos = screen.getAllByText('2')
    expect(twos.length).toBeGreaterThanOrEqual(1)
  })

  it('renders ayah counts', () => {
    render(<SurahList surahs={mockSurahs} progressMap={mockProgressMap} />)
    expect(screen.getByText('7 koran.ayahs')).toBeInTheDocument()
  })

  it('renders arabic names', () => {
    render(<SurahList surahs={mockSurahs} progressMap={mockProgressMap} />)
    expect(screen.getByText('سُورَةُ ٱلْفَاتِحَةِ')).toBeInTheDocument()
  })

  it('links each surah to its reader page', () => {
    render(<SurahList surahs={mockSurahs} progressMap={mockProgressMap} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/koran/1')
  })

  it('shows progress badge for surah with progress', () => {
    render(<SurahList surahs={mockSurahs} progressMap={mockProgressMap} />)
    expect(screen.getByText('koran.status_memorized')).toBeInTheDocument()
  })
})
