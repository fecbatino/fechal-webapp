import { render, screen } from '@testing-library/react'
import SectionCards from '@/components/home/SectionCards'

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
  useLocale: () => 'de',
}))

jest.mock('@/lib/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('SectionCards', () => {
  it('renders all 4 section cards', () => {
    render(<SectionCards />)
    expect(screen.getByText('sections.alltag')).toBeInTheDocument()
    expect(screen.getByText('sections.portfolio')).toBeInTheDocument()
    expect(screen.getByText('sections.hajj')).toBeInTheDocument()
    expect(screen.getByText('sections.vereine')).toBeInTheDocument()
  })

  it('renders section descriptions', () => {
    render(<SectionCards />)
    expect(screen.getByText('sections.alltag_desc')).toBeInTheDocument()
  })

  it('renders links to correct paths', () => {
    render(<SectionCards />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('/de/alltag')
  })
})
