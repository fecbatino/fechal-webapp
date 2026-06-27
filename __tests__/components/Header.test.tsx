import { type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import Header from '@/components/layout/Header'

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
  useLocale: () => 'de',
}))

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/de',
}))

jest.mock('@/lib/navigation', () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
  useRouter: () => ({ replace: jest.fn() }),
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
