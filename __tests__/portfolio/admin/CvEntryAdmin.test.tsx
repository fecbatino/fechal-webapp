import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CvEntryAdmin from '@/components/portfolio/admin/CvEntryAdmin'
import { CvEntry } from '@/lib/types'

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

const baseEntry: CvEntry = {
  id: 'cv-1',
  type: 'experience',
  title_de: 'Software Entwickler',
  title_fr: 'Développeur Logiciel',
  title_en: 'Software Developer',
  title_ar: 'مطور برمجيات',
  organization: 'Tech GmbH',
  start_year: 2020,
  end_year: null,
  description_de: null,
  description_fr: null,
  description_en: null,
  description_ar: null,
  sort_order: 0,
}

beforeEach(() => {
  mockUpsert.mockClear()
  mockDelete.mockClear()
  mockSelect.mockClear()
  mockSingle.mockClear()
  lastUpsertPayload = {}
})

describe('CvEntryAdmin', () => {
  it('renders existing CV entries', () => {
    render(<CvEntryAdmin initialEntries={[baseEntry]} />)
    expect(screen.getByText('Software Entwickler')).toBeInTheDocument()
  })

  it('shows create form when New button is clicked', () => {
    render(<CvEntryAdmin initialEntries={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    expect(screen.getByLabelText('portfolio.admin_field_title_de')).toBeInTheDocument()
  })

  it('hides form when Cancel is clicked', () => {
    render(<CvEntryAdmin initialEntries={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    fireEvent.click(screen.getByText('portfolio.admin_cancel'))
    expect(screen.queryByLabelText('portfolio.admin_field_title_de')).not.toBeInTheDocument()
  })

  it('calls upsert with cv entry data when Save is clicked', async () => {
    render(<CvEntryAdmin initialEntries={[]} />)
    fireEvent.click(screen.getByText('portfolio.admin_new'))
    fireEvent.change(screen.getByLabelText('portfolio.admin_field_title_de'), {
      target: { value: 'Neuer Job' },
    })
    fireEvent.click(screen.getByText('portfolio.admin_save'))
    await waitFor(() => expect(mockUpsert).toHaveBeenCalledTimes(1))
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ title_de: 'Neuer Job' })
    )
  })

  it('calls delete eq with entry id when Delete is clicked', async () => {
    render(<CvEntryAdmin initialEntries={[baseEntry]} />)
    fireEvent.click(screen.getByText('portfolio.admin_delete'))
    await waitFor(() => expect(mockDelete).toHaveBeenCalledTimes(1))
    expect(mockDelete).toHaveBeenCalledWith('id', 'cv-1')
  })
})
