import { render, screen, fireEvent } from '@testing-library/react'
import PackingChecklist from '@/components/hajj/PackingChecklist'
import { PACKING_CHECKLIST } from '@/lib/hajj-data'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'de',
}))

describe('PackingChecklist', () => {
  it('renders all checklist items', () => {
    render(<PackingChecklist items={PACKING_CHECKLIST} locale="de" />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(18)
  })

  it('renders document items in German locale', () => {
    render(<PackingChecklist items={PACKING_CHECKLIST} locale="de" />)
    expect(screen.getByText(/Reisepass/)).toBeInTheDocument()
  })

  it('renders items in French locale', () => {
    render(<PackingChecklist items={PACKING_CHECKLIST} locale="fr" />)
    expect(screen.getByText(/Passeport/)).toBeInTheDocument()
  })

  it('items start unchecked', () => {
    render(<PackingChecklist items={PACKING_CHECKLIST} locale="de" />)
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked())
  })

  it('clicking a checkbox marks it checked', () => {
    render(<PackingChecklist items={PACKING_CHECKLIST} locale="de" />)
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])
    expect(checkboxes[0]).toBeChecked()
  })
})
