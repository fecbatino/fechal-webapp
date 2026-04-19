import { render, screen, fireEvent } from '@testing-library/react'
import Flashcard from '@/components/alltag/arabisch/Flashcard'
import { ArabicCard } from '@/lib/types'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

const mockCard: ArabicCard = {
  id: 'card-1',
  arabic: 'بِسْمِ اللَّهِ',
  transliteration: 'Bismillah',
  meaning_de: 'Im Namen Gottes',
  meaning_fr: 'Au nom de Dieu',
  meaning_en: 'In the name of God',
  category: 'dua',
  created_at: '2026-04-01T00:00:00Z',
}

const mockOnRate = jest.fn()

describe('Flashcard', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('renders arabic text and transliteration on front', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    expect(screen.getByText('بِسْمِ اللَّهِ')).toBeInTheDocument()
    expect(screen.getByText('Bismillah')).toBeInTheDocument()
  })

  it('does not show translation before answer is revealed', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    expect(screen.queryByText('Im Namen Gottes')).not.toBeInTheDocument()
  })

  it('shows show_answer button initially', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    expect(screen.getByText('arabisch.show_answer')).toBeInTheDocument()
  })

  it('reveals translation after clicking show answer', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    expect(screen.getByText('Im Namen Gottes')).toBeInTheDocument()
  })

  it('shows rating buttons after reveal', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    expect(screen.getByText('arabisch.quality_again')).toBeInTheDocument()
    expect(screen.getByText('arabisch.quality_hard')).toBeInTheDocument()
    expect(screen.getByText('arabisch.quality_good')).toBeInTheDocument()
    expect(screen.getByText('arabisch.quality_easy')).toBeInTheDocument()
  })

  it('calls onRate with 1 when Again is clicked', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    fireEvent.click(screen.getByText('arabisch.quality_again'))
    expect(mockOnRate).toHaveBeenCalledWith(1)
  })

  it('calls onRate with 3 when Hard is clicked', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    fireEvent.click(screen.getByText('arabisch.quality_hard'))
    expect(mockOnRate).toHaveBeenCalledWith(3)
  })

  it('calls onRate with 4 when Good is clicked', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    fireEvent.click(screen.getByText('arabisch.quality_good'))
    expect(mockOnRate).toHaveBeenCalledWith(4)
  })

  it('calls onRate with 5 when Easy is clicked', () => {
    render(<Flashcard card={mockCard} locale="de" onRate={mockOnRate} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    fireEvent.click(screen.getByText('arabisch.quality_easy'))
    expect(mockOnRate).toHaveBeenCalledWith(5)
  })

  it('shows french translation when locale is fr', () => {
    render(<Flashcard card={mockCard} locale="fr" onRate={mockOnRate} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    expect(screen.getByText('Au nom de Dieu')).toBeInTheDocument()
  })

  it('shows english translation when locale is en', () => {
    render(<Flashcard card={mockCard} locale="en" onRate={mockOnRate} />)
    fireEvent.click(screen.getByText('arabisch.show_answer'))
    expect(screen.getByText('In the name of God')).toBeInTheDocument()
  })
})
