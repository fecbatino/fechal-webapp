'use client'
import { useTranslations, useLocale } from 'next-intl'
import { PortfolioProject } from '@/lib/types'
import { getLocalizedText } from '@/lib/hajj-data'

interface Props {
  project: PortfolioProject
  locale?: string
}

export default function ProjectCard({ project, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('portfolio')

  const title = getLocalizedText(project as unknown as Record<string, unknown>, 'title', locale)
  const description = getLocalizedText(project as unknown as Record<string, unknown>, 'description', locale)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {project.screenshot_url && (
        <img
          src={project.screenshot_url}
          alt={title ?? ''}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        {description && (
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              aria-label={`${t('github')}: ${title}`}
            >
              {t('github')} ↗
            </a>
          )}

          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              aria-label={`${t('live_demo')}: ${title}`}
            >
              {t('live_demo')} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}