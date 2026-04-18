import { render, screen } from '@testing-library/react'
import Header from '@/components/layout/Header'

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
  useLocale: () => 'de',
}))

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/de',
}))

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('nav.portfolio')).toBeInTheDocument()
    expect(screen.getByText('nav.hajj')).toBeInTheDocument()
  })

  it('renders login link when no user', () => {
    render(<Header />)
    expect(screen.getByText('nav.login')).toBeInTheDocument()
  })
})
