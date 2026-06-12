import { render, screen, fireEvent } from '@testing-library/react'
import ProjectGrid from '@/components/portfolio/ProjectGrid'
import { PortfolioProject } from '@/lib/types'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'de',
}))

const webProject: PortfolioProject = {
  id: 'proj-1',
  category: 'web',
  title_de: 'Web Projekt',
  title_fr: 'Projet Web',
  title_en: 'Web Project',
  description_de: 'Web Beschreibung',
  description_fr: 'Description Web',
  description_en: 'Web Description',
  tech_stack: ['Next.js'],
  github_url: null,
  live_url: null,
  screenshot_url: null,
  sort_order: 0,
  created_at: '2026-04-01T00:00:00Z',
}

const aiProject: PortfolioProject = {
  ...webProject,
  id: 'proj-2',
  category: 'ai',
  title_de: 'KI Projekt',
  title_fr: 'Projet IA',
  title_en: 'AI Project',
  description_de: 'KI Beschreibung',
  description_fr: 'Description IA',
  description_en: 'AI Description',
}

const vereineProject: PortfolioProject = {
  ...webProject,
  id: 'proj-3',
  category: 'vereine',
  title_de: 'Verein Projekt',
  title_fr: 'Projet Association',
  title_en: 'Association Project',
  description_de: 'Verein Beschreibung',
  description_fr: 'Description Association',
  description_en: 'Association Description',
}

describe('ProjectGrid', () => {
  it('renders all projects when category is all', () => {
    render(<ProjectGrid projects={[webProject, aiProject, vereineProject]} locale="de" />)
    expect(screen.getByText('Web Projekt')).toBeInTheDocument()
    expect(screen.getByText('KI Projekt')).toBeInTheDocument()
    expect(screen.getByText('Verein Projekt')).toBeInTheDocument()
  })

  it('renders all 4 category filter buttons', () => {
    render(<ProjectGrid projects={[]} locale="de" />)
    expect(screen.getByText('portfolio.category_all')).toBeInTheDocument()
    expect(screen.getByText('portfolio.category_web')).toBeInTheDocument()
    expect(screen.getByText('portfolio.category_ai')).toBeInTheDocument()
    expect(screen.getByText('portfolio.category_vereine')).toBeInTheDocument()
  })

  it('filters to web category on click', () => {
    render(<ProjectGrid projects={[webProject, aiProject]} locale="de" />)
    fireEvent.click(screen.getByRole('button', { name: 'portfolio.category_web' }))
    expect(screen.getByText('Web Projekt')).toBeInTheDocument()
    expect(screen.queryByText('KI Projekt')).not.toBeInTheDocument()
  })

  it('filters to ai category on click', () => {
    render(<ProjectGrid projects={[webProject, aiProject]} locale="de" />)
    fireEvent.click(screen.getByRole('button', { name: 'portfolio.category_ai' }))
    expect(screen.queryByText('Web Projekt')).not.toBeInTheDocument()
    expect(screen.getByText('KI Projekt')).toBeInTheDocument()
  })

  it('shows no_projects when filtered category has no projects', () => {
    render(<ProjectGrid projects={[webProject]} locale="de" />)
    fireEvent.click(screen.getByRole('button', { name: 'portfolio.category_ai' }))
    expect(screen.getByText('portfolio.no_projects')).toBeInTheDocument()
  })

  it('shows all projects again after switching back to all', () => {
    render(<ProjectGrid projects={[webProject, aiProject]} locale="de" />)
    fireEvent.click(screen.getByRole('button', { name: 'portfolio.category_web' }))
    fireEvent.click(screen.getByRole('button', { name: 'portfolio.category_all' }))
    expect(screen.getByText('Web Projekt')).toBeInTheDocument()
    expect(screen.getByText('KI Projekt')).toBeInTheDocument()
  })
})
