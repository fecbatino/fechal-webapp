import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SkillAdmin from '@/components/portfolio/admin/SkillAdmin'
import { PortfolioSkill } from '@/lib/types'

let lastUpsertPayload: Record<string, unknown> = {}
const mockSingle = jest.fn().mockImplementation(() =>
  Promise.resolve({ data: { id: 'new-id', ...lastUpsertPayload }, error: null })
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

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

const baseSkill: PortfolioSkill = {
  id: 'skill-1',
  name: 'TypeScript',
  category: 'frontend',
  sort_order: 0,
}

beforeEach(() => {
  mockUpsert.mockClear()
  mockDelete.mockClear()
  mockSelect.mockClear()
  mockSingle.mockClear()
  lastUpsertPayload = {}
})

describe('SkillAdmin', () => {
  it('renders the skill list with existing skills', () => {
    render(<SkillAdmin initialSkills={[baseSkill]} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('shows create form when New button is clicked', () => {
    render(<SkillAdmin initialSkills={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    expect(screen.getByLabelText('portfolio.admin_field_name')).toBeInTheDocument()
  })

  it('hides form when Cancel is clicked', () => {
    render(<SkillAdmin initialSkills={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    fireEvent.click(screen.getByText('portfolio.admin_cancel'))
    expect(screen.queryByLabelText('portfolio.admin_field_name')).not.toBeInTheDocument()
  })

  it('calls upsert with skill data when Save is clicked', async () => {
    render(<SkillAdmin initialSkills={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    fireEvent.change(screen.getByLabelText('portfolio.admin_field_name'), {
      target: { value: 'React' },
    })
    fireEvent.click(screen.getByText('portfolio.admin_save'))
    await waitFor(() => expect(mockUpsert).toHaveBeenCalledTimes(1))
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'React' })
    )
  })

  it('calls delete eq with skill id when Delete is clicked', async () => {
    render(<SkillAdmin initialSkills={[baseSkill]} />)
    fireEvent.click(screen.getByText('portfolio.admin_delete'))
    await waitFor(() => expect(mockDelete).toHaveBeenCalledTimes(1))
    expect(mockDelete).toHaveBeenCalledWith('id', 'skill-1')
  })
})
