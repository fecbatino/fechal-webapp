import { render, screen } from '@testing-library/react'
import NotesFeed from '@/components/alltag/familie/NotesFeed'
import { FamilyNote } from '@/lib/types'

const mockNotes: FamilyNote[] = [
  { id: '1', family_id: 'fam1', content: 'Heute gibt es Couscous 🍲', created_by: 'user1', created_at: '2026-04-18T12:00:00Z' },
  { id: '2', family_id: 'fam1', content: 'Vergiss nicht die Schule!', created_by: 'user2', created_at: '2026-04-18T11:00:00Z' },
]
const mockOnDelete = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

describe('NotesFeed', () => {
  it('renders note content', () => {
    render(<NotesFeed notes={mockNotes} currentUserId="user1" onDelete={mockOnDelete} />)
    expect(screen.getByText('Heute gibt es Couscous 🍲')).toBeInTheDocument()
    expect(screen.getByText('Vergiss nicht die Schule!')).toBeInTheDocument()
  })

  it('shows delete button only for own notes', () => {
    render(<NotesFeed notes={mockNotes} currentUserId="user1" onDelete={mockOnDelete} />)
    const deleteButtons = screen.getAllByRole('button', { name: /familie\.delete/i })
    expect(deleteButtons).toHaveLength(1)
  })

  it('shows empty state when no notes', () => {
    render(<NotesFeed notes={[]} currentUserId="user1" onDelete={mockOnDelete} />)
    expect(screen.getByText('familie.no_notes')).toBeInTheDocument()
  })
})
