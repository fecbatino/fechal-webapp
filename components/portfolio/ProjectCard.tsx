'use client'
import { useTranslations } from 'next-intl'
import { PortfolioProject } from '@/lib/types'

interface Props {
  project: PortfolioProject
  locale: string
}

function getLocalizedText(project: PortfolioProject, field: 'title' | 'description', locale: string): string {
  const key = `${field}_${locale}` as keyof PortfolioProject
  return (project[key] as string) || (project[`${field}_de`] as string)
}

export default function ProjectCard({ project, locale }: Props) {
  const t = useTranslations('portfolio')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group flex flex-col">
      {project.screenshot_url && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={project.screenshot_url}
            alt={getLocalizedText(project, 'title', locale)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-2">
          {getLocalizedText(project, 'title', locale)}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
          {getLocalizedText(project, 'description', locale)}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              {t('github')} ↗
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              {t('live_demo')} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
