import { render, screen } from '@testing-library/react'
import AlltagPage from '@/app/[locale]/alltag/page'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'de',
}))
jest.mock('@/lib/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('AlltagPage', () => {
  it('renders sub-navigation cards', () => {
    render(<AlltagPage />)
    expect(screen.getByText('alltag.familie')).toBeInTheDocument()
    expect(screen.getByText('alltag.arabisch')).toBeInTheDocument()
    expect(screen.getByText('alltag.koran')).toBeInTheDocument()
  })

  it('renders familie link', () => {
    render(<AlltagPage />)
    expect(screen.getByRole('link', { name: /alltag\.familie/i })).toHaveAttribute('href', '/familie')
  })
})
