import { render, screen, fireEvent } from '@testing-library/react'
import TaskList from '@/components/alltag/familie/TaskList'
import { FamilyTask } from '@/lib/types'

const mockTasks: FamilyTask[] = [
  {
    id: '1',
    family_id: 'fam1',
    title: 'Milch kaufen',
    completed: false,
    category: 'shopping',
    created_by: 'user1',
    created_at: '2026-04-18T10:00:00Z',
  },
  {
    id: '2',
    family_id: 'fam1',
    title: 'Zimmer aufräumen',
    completed: true,
    category: 'task',
    created_by: 'user1',
    created_at: '2026-04-18T09:00:00Z',
  },
]

const mockOnToggle = jest.fn()
const mockOnDelete = jest.fn()
const mockOnAdd = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

describe('TaskList', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('renders task titles', () => {
    render(<TaskList tasks={mockTasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onAdd={mockOnAdd} />)
    expect(screen.getByText('Milch kaufen')).toBeInTheDocument()
    expect(screen.getByText('Zimmer aufräumen')).toBeInTheDocument()
  })

  it('shows completed task as checked', () => {
    render(<TaskList tasks={mockTasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onAdd={mockOnAdd} />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).toBeChecked()
  })

  it('calls onToggle when checkbox clicked', () => {
    render(<TaskList tasks={mockTasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onAdd={mockOnAdd} />)
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    expect(mockOnToggle).toHaveBeenCalledWith('1', true)
  })

  it('shows empty state when no tasks', () => {
    render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onAdd={mockOnAdd} />)
    expect(screen.getByText('familie.no_tasks')).toBeInTheDocument()
  })
})
