import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { PortfolioProject, PortfolioSkill, CvEntry } from '@/lib/types'
import { cvEntries as staticCvEntries } from '@/lib/cv-data'
import { staticProjects, staticSkills } from '@/lib/portfolio-data'
import ProjectGrid from '@/components/portfolio/ProjectGrid'
import SkillTags from '@/components/portfolio/SkillTags'
import CvTimeline from '@/components/portfolio/CvTimeline'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('portfolio')
  const supabase = await createClient()

  const [
    { data: dbProjects },
    { data: dbSkills },
    { data: dbCvEntries },
  ] = await Promise.all([
    supabase.from('portfolio_projects').select('*').order('sort_order'),
    supabase.from('portfolio_skills').select('*').order('sort_order'),
    supabase.from('cv_entries').select('*').order('sort_order'),
  ])

  // Use static data as primary; fall back to Supabase if static is empty
  const resolvedProjects = (dbProjects && dbProjects.length > 0 ? dbProjects : staticProjects) as PortfolioProject[]
  const resolvedSkills = (dbSkills && dbSkills.length > 0 ? dbSkills : staticSkills) as PortfolioSkill[]
  const resolvedCvEntries = (dbCvEntries && dbCvEntries.length > 0 ? dbCvEntries : staticCvEntries) as CvEntry[]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            ✦ {t('title')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{t('title')}</h1>
          <p className="text-muted-fg text-lg max-w-xl">{t('subtitle')}</p>
        </div>

        {/* Projects */}
        <section className="mb-20">
          <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            {t('projects_title')}
          </h2>
          <ProjectGrid projects={resolvedProjects} />
        </section>

        {/* Skills */}
        <section className="mb-20">
          <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 0 1 4-4z" />
              <path d="M2 22c0-5 4.5-8 10-8s10 3 10 8" />
            </svg>
            {t('skills_title')}
          </h2>
          <div className="glass-card rounded-2xl p-8">
            <SkillTags skills={resolvedSkills} />
          </div>
        </section>

        {/* CV */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {t('cv_title')}
          </h2>
          <CvTimeline entries={resolvedCvEntries} />
        </section>
      </div>
    </div>
  )
}