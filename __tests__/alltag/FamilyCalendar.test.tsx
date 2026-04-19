import { render, screen } from '@testing-library/react'
import FamilyCalendar from '@/components/alltag/familie/FamilyCalendar'
import { FamilyEvent } from '@/lib/types'

const mockEvents: FamilyEvent[] = [
  { id: '1', family_id: 'fam1', title: 'Arzttermin', event_date: '2026-04-20', description: 'Kinderarzt 10:00', created_by: 'user1', created_at: '2026-04-18T08:00:00Z' },
  { id: '2', family_id: 'fam1', title: 'Schulausflug', event_date: '2026-04-25', description: null, created_by: 'user2', created_at: '2026-04-18T09:00:00Z' },
]
const mockOnDelete = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

describe('FamilyCalendar', () => {
  it('renders event titles', () => {
    render(<FamilyCalendar events={mockEvents} currentUserId="user1" onDelete={mockOnDelete} />)
    expect(screen.getByText('Arzttermin')).toBeInTheDocument()
    expect(screen.getByText('Schulausflug')).toBeInTheDocument()
  })

  it('renders event dates', () => {
    render(<FamilyCalendar events={mockEvents} currentUserId="user1" onDelete={mockOnDelete} />)
    expect(screen.getByText('2026-04-20')).toBeInTheDocument()
  })

  it('renders description when present', () => {
    render(<FamilyCalendar events={mockEvents} currentUserId="user1" onDelete={mockOnDelete} />)
    expect(screen.getByText('Kinderarzt 10:00')).toBeInTheDocument()
  })

  it('shows empty state when no events', () => {
    render(<FamilyCalendar events={[]} currentUserId="user1" onDelete={mockOnDelete} />)
    expect(screen.getByText('familie.no_events')).toBeInTheDocument()
  })
})
