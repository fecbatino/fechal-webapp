import { render, screen } from '@testing-library/react'
import ProjectCard from '@/components/portfolio/ProjectCard'
import { PortfolioProject } from '@/lib/types'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'de',
}))

const mockProject: PortfolioProject = {
  id: 'proj-1',
  category: 'web',
  title_de: 'Mein Projekt',
  title_fr: 'Mon Projet',
  title_en: 'My Project',
  description_de: 'Eine tolle Web-App.',
  description_fr: 'Une super application web.',
  description_en: 'A great web app.',
  tech_stack: ['Next.js', 'TypeScript'],
  github_url: 'https://github.com/example/repo',
  live_url: 'https://example.com',
  screenshot_url: null,
  sort_order: 0,
  created_at: '2026-04-01T00:00:00Z',
}

describe('ProjectCard', () => {
  it('renders localized title in German', () => {
    render(<ProjectCard project={mockProject} locale="de" />)
    expect(screen.getByText('Mein Projekt')).toBeInTheDocument()
  })

  it('renders localized title in French', () => {
    render(<ProjectCard project={mockProject} locale="fr" />)
    expect(screen.getByText('Mon Projet')).toBeInTheDocument()
  })

  it('renders localized title in English', () => {
    render(<ProjectCard project={mockProject} locale="en" />)
    expect(screen.getByText('My Project')).toBeInTheDocument()
  })

  it('renders tech stack tags', () => {
    render(<ProjectCard project={mockProject} locale="de" />)
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders GitHub link with correct href', () => {
    render(<ProjectCard project={mockProject} locale="de" />)
    const link = screen.getByText('portfolio.github').closest('a')
    expect(link).toHaveAttribute('href', 'https://github.com/example/repo')
  })

  it('renders live demo link with correct href', () => {
    render(<ProjectCard project={mockProject} locale="de" />)
    const link = screen.getByText('portfolio.live_demo').closest('a')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('does not render image when screenshot_url is null', () => {
    render(<ProjectCard project={mockProject} locale="de" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders plain img for remote screenshot URLs', () => {
    const project = { ...mockProject, screenshot_url: 'https://example.com/shot.png' }
    render(<ProjectCard project={project} locale="de" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/shot.png')
  })

  it('renders optimized image with alt text for local screenshot paths', () => {
    const project = { ...mockProject, screenshot_url: '/portfolio/mein-projekt.webp' }
    render(<ProjectCard project={project} locale="de" />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Mein Projekt')
  })

  it('does not render GitHub link when github_url is null', () => {
    const project = { ...mockProject, github_url: null }
    render(<ProjectCard project={project} locale="de" />)
    expect(screen.queryByText('portfolio.github ↗')).not.toBeInTheDocument()
  })

  it('does not render live demo link when live_url is null', () => {
    const project = { ...mockProject, live_url: null }
    render(<ProjectCard project={project} locale="de" />)
    expect(screen.queryByText('portfolio.live_demo ↗')).not.toBeInTheDocument()
  })
})
