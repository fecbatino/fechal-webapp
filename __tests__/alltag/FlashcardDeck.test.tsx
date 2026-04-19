import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FlashcardDeck from '@/components/alltag/arabisch/FlashcardDeck'
import { ArabicCard, UserCardProgress } from '@/lib/types'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

const mockUpsert = jest.fn().mockResolvedValue({ error: null })
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      upsert: mockUpsert,
    }),
  }),
}))

const mockCard1: ArabicCard = {
  id: 'card-1', arabic: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah',
  meaning_de: 'Im Namen Gottes', meaning_fr: 'Au nom de Dieu', meaning_en: 'In the name of God',
  category: 'dua', created_at: '2026-04-01T00:00:00Z',
}
const mockCard2: ArabicCard = {
  id: 'card-2', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah',
  meaning_de: 'Lob sei Gott', meaning_fr: 'Louange à Dieu', meaning_en: 'Praise be to God',
  category: 'dua', created_at: '2026-04-01T00:00:00Z',
}
const mockProgressMap: Record<string, UserCardProgress> = {}
const mockOnComplete = jest.fn()

describe('FlashcardDeck', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('shows the first card arabic text', () => {
    render(<FlashcardDeck cards={[mockCard1, mockCard2]} progressMap={mockProgressMap} userId="user-1" locale="de" onComplete={mockOnComplete} />)
    expect(screen.getByText('بِسْمِ اللَّهِ')).toBeInTheDocument()
  })

  it('shows progress counter', () => {
    render(<FlashcardDeck cards={[mockCard1, mockCard2]} progressMap={mockProgressMap} userId="user-1" locale="de" onComplete={mockOnComplete} />)
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('advances to next card after rating', async () => {
    render(<FlashcardDeck cards={[mockCard1, mockCard2]} progressMap={mockProgressMap} userId="user-1" locale="de" onComplete={mockOnComplete} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    fireEvent.click(screen.getByText('arabisch.quality_good'))
    await waitFor(() => {
      expect(screen.getByText('الْحَمْدُ لِلَّهِ')).toBeInTheDocument()
    })
  })

  it('calls onComplete after all cards are rated', async () => {
    render(<FlashcardDeck cards={[mockCard1]} progressMap={mockProgressMap} userId="user-1" locale="de" onComplete={mockOnComplete} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    fireEvent.click(screen.getByText('arabisch.quality_good'))
    await waitFor(() => { expect(mockOnComplete).toHaveBeenCalled() })
  })

  it('calls supabase upsert after rating', async () => {
    render(<FlashcardDeck cards={[mockCard1]} progressMap={mockProgressMap} userId="user-1" locale="de" onComplete={mockOnComplete} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    fireEvent.click(screen.getByText('arabisch.quality_good'))
    await waitFor(() => { expect(mockUpsert).toHaveBeenCalled() })
  })
})
