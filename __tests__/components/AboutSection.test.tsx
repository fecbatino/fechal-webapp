import { render, screen } from '@testing-library/react'
import AboutSection from '@/components/home/AboutSection'

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}))

describe('AboutSection', () => {
  it('renders about title and bio', () => {
    render(<AboutSection />)
    expect(screen.getByText('home.about_title')).toBeInTheDocument()
    expect(screen.getByText('home.about_bio')).toBeInTheDocument()
  })

  it('renders contact link', () => {
    render(<AboutSection />)
    const link = screen.getByRole('link', { name: 'home.contact' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'mailto:fecbatino@gmail.com')
  })

  it('renders interest tags', () => {
    render(<AboutSection />)
    expect(screen.getByText('Familie')).toBeInTheDocument()
    expect(screen.getByText('Glaube')).toBeInTheDocument()
  })
})
