'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PortfolioProject, ProjectCategory } from '@/lib/types'
import ProjectCard from './ProjectCard'

type FilterCategory = 'all' | ProjectCategory

interface Props {
  projects: PortfolioProject[]
  locale: string
}

const FILTER_CATEGORIES: FilterCategory[] = ['all', 'web', 'ai', 'vereine']

export default function ProjectGrid({ projects, locale }: Props) {
  const t = useTranslations('portfolio')
  const [active, setActive] = useState<FilterCategory>('all')

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active)

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(`category_${cat}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">{t('no_projects')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
