import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { PortfolioProject, PortfolioSkill, CvEntry } from '@/lib/types'
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
    { data: projects },
    { data: skills },
    { data: cvEntries },
  ] = await Promise.all([
    supabase.from('portfolio_projects').select('*').order('sort_order'),
    supabase.from('portfolio_skills').select('*').order('sort_order'),
    supabase.from('cv_entries').select('*').order('sort_order'),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-500 text-lg">{t('subtitle')}</p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('projects_title')}</h2>
        <ProjectGrid projects={(projects ?? []) as PortfolioProject[]} />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('skills_title')}</h2>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <SkillTags skills={(skills ?? []) as PortfolioSkill[]} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('cv_title')}</h2>
        <CvTimeline entries={(cvEntries ?? []) as CvEntry[]} />
      </section>
    </div>
  )
}
