import { render, screen } from '@testing-library/react'
import SkillTags from '@/components/portfolio/SkillTags'
import { PortfolioSkill } from '@/lib/types'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

const mockSkills: PortfolioSkill[] = [
  { id: 'skill-1', name: 'React', category: 'frontend', sort_order: 1 },
  { id: 'skill-2', name: 'Next.js', category: 'frontend', sort_order: 2 },
  { id: 'skill-3', name: 'Python', category: 'backend', sort_order: 1 },
  { id: 'skill-4', name: 'Claude API', category: 'ai', sort_order: 1 },
  { id: 'skill-5', name: 'Git', category: 'tools', sort_order: 1 },
]

describe('SkillTags', () => {
  it('renders all skill names', () => {
    render(<SkillTags skills={mockSkills} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('Claude API')).toBeInTheDocument()
    expect(screen.getByText('Git')).toBeInTheDocument()
  })

  it('renders all four category headings', () => {
    render(<SkillTags skills={mockSkills} />)
    expect(screen.getByText('portfolio.skill_category_frontend')).toBeInTheDocument()
    expect(screen.getByText('portfolio.skill_category_backend')).toBeInTheDocument()
    expect(screen.getByText('portfolio.skill_category_ai')).toBeInTheDocument()
    expect(screen.getByText('portfolio.skill_category_tools')).toBeInTheDocument()
  })

  it('does not render empty category sections', () => {
    const noAiSkills = mockSkills.filter((s) => s.category !== 'ai')
    render(<SkillTags skills={noAiSkills} />)
    expect(screen.queryByText('portfolio.skill_category_ai')).not.toBeInTheDocument()
  })

  it('renders empty state when no skills provided', () => {
    render(<SkillTags skills={[]} />)
    expect(screen.queryByText('portfolio.skill_category_frontend')).not.toBeInTheDocument()
  })
})
