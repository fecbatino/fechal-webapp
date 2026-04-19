import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { PortfolioProject, PortfolioSkill, CvEntry } from '@/lib/types'
import ProjectAdmin from '@/components/portfolio/admin/ProjectAdmin'
import SkillAdmin from '@/components/portfolio/admin/SkillAdmin'
import CvEntryAdmin from '@/components/portfolio/admin/CvEntryAdmin'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function PortfolioAdminPage({ params }: Props) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect(`/${locale}`)
  }

  const t = await getTranslations('portfolio')

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
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin_title')}</h1>
      </div>

      <div className="space-y-12">
        <section>
          <ProjectAdmin initialProjects={(projects ?? []) as PortfolioProject[]} />
        </section>

        <hr className="border-gray-200" />

        <section>
          <SkillAdmin initialSkills={(skills ?? []) as PortfolioSkill[]} />
        </section>

        <hr className="border-gray-200" />

        <section>
          <CvEntryAdmin initialEntries={(cvEntries ?? []) as CvEntry[]} />
        </section>
      </div>
    </div>
  )
}
