import { render, screen } from '@testing-library/react'
import FamilyMembers from '@/components/alltag/familie/FamilyMembers'

const mockMembers = [
  { id: 'user1', email: 'mama@test.de', full_name: 'Mama Batakpalé', family_role: 'parent' as const },
  { id: 'user2', email: 'kind@test.de', full_name: null, family_role: 'child' as const },
]

describe('FamilyMembers', () => {
  it('renders member names', () => {
    render(<FamilyMembers members={mockMembers} currentUserId="user1" />)
    expect(screen.getByText('Mama Batakpalé')).toBeInTheDocument()
    expect(screen.getByText('kind@test.de')).toBeInTheDocument()
  })

  it('highlights current user', () => {
    render(<FamilyMembers members={mockMembers} currentUserId="user1" />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveClass('border-emerald-300')
    expect(items[1]).not.toHaveClass('border-emerald-300')
  })

  it('shows role emoji for parent', () => {
    render(<FamilyMembers members={mockMembers} currentUserId="user1" />)
    expect(screen.getByText('👨‍👩‍👧')).toBeInTheDocument()
  })
})
