import { render, screen } from '@testing-library/react'
import FamiliePage from '@/app/[locale]/alltag/familie/page'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'de',
}))
jest.mock('@/lib/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('FamiliePage', () => {
  it('renders familie title', () => {
    render(<FamiliePage />)
    expect(screen.getByText('familie.title')).toBeInTheDocument()
  })

  it('renders navigation links to sub-pages', () => {
    render(<FamiliePage />)
    expect(screen.getByRole('link', { name: /familie\.kalender/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /familie\.aufgaben/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /familie\.notizen/i })).toBeInTheDocument()
  })
})
