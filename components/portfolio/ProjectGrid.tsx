'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PortfolioProject, ProjectCategory } from '@/lib/types'
import { useLocale } from 'next-intl'
import ProjectCard from './ProjectCard'

type FilterCategory = 'all' | ProjectCategory

interface Props {
  projects: PortfolioProject[]
  locale?: string
}

const FILTER_CATEGORIES: FilterCategory[] = ['all', 'web', 'ai', 'vereine']

const categoryColors: Record<string, string> = {
  all: 'teal',
  web: 'teal',
  ai: 'violet',
  vereine: 'emerald',
}

export default function ProjectGrid({ projects, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('portfolio')
  const [active, setActive] = useState<FilterCategory>('all')

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active)

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTER_CATEGORIES.map((cat) => {
          const color = categoryColors[cat]
          const isActive = active === cat
          const activeStyles: Record<string, string> = {
            teal: 'bg-teal-500/20 border-teal-500/40 text-teal-300',
            violet: 'bg-violet-500/20 border-violet-500/40 text-violet-300',
            emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
          }
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? activeStyles[color]
                  : 'border-border text-muted-fg hover:border-border hover:text-subtle-fg'
              }`}
            >
              {t(`category_${cat}`)}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-fg text-center py-12">{t('no_projects')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}