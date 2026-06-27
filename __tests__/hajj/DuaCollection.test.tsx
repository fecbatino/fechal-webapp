import { render, screen } from '@testing-library/react'
import DuaCollection from '@/components/hajj/DuaCollection'
import { HAJJ_DUAS } from '@/lib/hajj-data'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'de',
}))

describe('DuaCollection', () => {
  it('renders a card for each dua', () => {
    render(<DuaCollection duas={HAJJ_DUAS} locale="de" />)
    expect(screen.getAllByRole('article')).toHaveLength(7)
  })

  it('renders Arabic text for the Talbiyah', () => {
    render(<DuaCollection duas={HAJJ_DUAS} locale="de" />)
    expect(screen.getByText(/لَبَّيْكَ اللَّهُمَّ/)).toBeInTheDocument()
  })

  it('renders the transliteration for the Talbiyah', () => {
    render(<DuaCollection duas={HAJJ_DUAS} locale="de" />)
    expect(screen.getByText(/Labbayk Allāhumma labbayk/)).toBeInTheDocument()
  })

  it('renders German meaning in German locale', () => {
    render(<DuaCollection duas={HAJJ_DUAS} locale="de" />)
    expect(screen.getByText(/Hier bin ich, o Allah/)).toBeInTheDocument()
  })
})
