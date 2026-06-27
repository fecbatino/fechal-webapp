import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProjectAdmin from '@/components/portfolio/admin/ProjectAdmin'
import { PortfolioProject } from '@/lib/types'

// --- Supabase mock ---
let lastUpsertPayload: Record<string, unknown> = {}
const mockSingle = jest.fn().mockImplementation(() =>
  Promise.resolve({ data: { id: 'new-id', created_at: '2026-04-19T00:00:00Z', ...lastUpsertPayload }, error: null })
)
const mockSelect = jest.fn().mockReturnValue({ single: mockSingle })
const mockUpsert = jest.fn().mockImplementation((payload: Record<string, unknown>) => {
  lastUpsertPayload = payload
  return { select: mockSelect }
})
const mockDelete = jest.fn().mockResolvedValue({ error: null })
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      upsert: mockUpsert,
      delete: () => ({ eq: mockDelete }),
    }),
  }),
}))

// --- next-intl mock ---
jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

const baseProject: PortfolioProject = {
  id: 'proj-1',
  category: 'web',
  title_de: 'Test Projekt',
  title_fr: 'Test Projet',
  title_en: 'Test Project',
  title_ar: 'مشروع اختبار',
  description_de: 'Beschreibung',
  description_fr: 'Description',
  description_en: 'Description EN',
  description_ar: 'الوصف',
  tech_stack: ['Next.js', 'TypeScript'],
  github_url: 'https://github.com/test',
  live_url: null,
  screenshot_url: null,
  sort_order: 0,
  created_at: '2026-04-01T00:00:00Z',
}

beforeEach(() => {
  mockUpsert.mockClear()
  mockDelete.mockClear()
  mockSelect.mockClear()
  mockSingle.mockClear()
  lastUpsertPayload = {}
})

describe('ProjectAdmin', () => {
  it('renders the project list with existing projects', () => {
    render(<ProjectAdmin initialProjects={[baseProject]} />)
    expect(screen.getByText('Test Projekt')).toBeInTheDocument()
  })

  it('renders the New button', () => {
    render(<ProjectAdmin initialProjects={[]} />)
    expect(screen.getByText('portfolio.admin_new')).toBeInTheDocument()
  })

  it('shows create form when New button is clicked', () => {
    render(<ProjectAdmin initialProjects={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    expect(screen.getByLabelText('portfolio.admin_field_title_de')).toBeInTheDocument()
  })

  it('hides form when Cancel is clicked', () => {
    render(<ProjectAdmin initialProjects={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    fireEvent.click(screen.getByText('portfolio.admin_cancel'))
    expect(screen.queryByLabelText('portfolio.admin_field_title_de')).not.toBeInTheDocument()
  })

  it('calls upsert when Save is clicked with form data', async () => {
    render(<ProjectAdmin initialProjects={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    fireEvent.change(screen.getByLabelText('portfolio.admin_field_title_de'), {
      target: { value: 'Neues Projekt' },
    })
    fireEvent.click(screen.getByText('portfolio.admin_save'))
    await waitFor(() => expect(mockUpsert).toHaveBeenCalledTimes(1))
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ title_de: 'Neues Projekt' })
    )
  })

  it('shows Edit button for each project and pre-fills the form', () => {
    render(<ProjectAdmin initialProjects={[baseProject]} />)
    fireEvent.click(screen.getByText('portfolio.admin_edit'))
    expect(
      (screen.getByLabelText('portfolio.admin_field_title_de') as HTMLInputElement).value
    ).toBe('Test Projekt')
  })

  it('calls delete eq with the project id when Delete is clicked', async () => {
    render(<ProjectAdmin initialProjects={[baseProject]} />)
    fireEvent.click(screen.getByText('portfolio.admin_delete'))
    await waitFor(() => expect(mockDelete).toHaveBeenCalledTimes(1))
    expect(mockDelete).toHaveBeenCalledWith('id', 'proj-1')
  })

  it('adds the new project to the displayed list after successful save', async () => {
    render(<ProjectAdmin initialProjects={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    fireEvent.change(screen.getByLabelText('portfolio.admin_field_title_de'), {
      target: { value: 'Brandneues Projekt' },
    })
    fireEvent.click(screen.getByText('portfolio.admin_save'))
    await waitFor(() =>
      expect(screen.getByText('Brandneues Projekt')).toBeInTheDocument()
    )
  })
})
