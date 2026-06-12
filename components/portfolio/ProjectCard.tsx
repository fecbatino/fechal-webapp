'use client'
import { useTranslations, useLocale } from 'next-intl'
import { PortfolioProject } from '@/lib/types'
import { getLocalizedText } from '@/lib/hajj-data'

interface Props {
  project: PortfolioProject
  locale?: string
}

const categoryMeta: Record<string, { labelKey: string; gradient: string; icon: string }> = {
  web: {
    labelKey: 'category_web',
    gradient: 'from-teal-900/40 to-emerald-900/30',
    icon: '🌐',
  },
  ai: {
    labelKey: 'category_ai',
    gradient: 'from-violet-900/40 to-indigo-900/30',
    icon: '🤖',
  },
  vereine: {
    labelKey: 'category_vereine',
    gradient: 'from-emerald-900/40 to-teal-900/30',
    icon: '🏛️',
  },
}

export default function ProjectCard({ project, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('portfolio')

  const title = getLocalizedText(project as unknown as Record<string, unknown>, 'title', locale)
  const description = getLocalizedText(project as unknown as Record<string, unknown>, 'description', locale)
  const meta = categoryMeta[project.category] ?? categoryMeta.web
  const categoryLabel = t(meta.labelKey)

  return (
    <div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1">
      {/* Screenshot / Placeholder */}
      {project.screenshot_url ? (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={project.screenshot_url}
            alt={title ?? ''}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
        </div>
      ) : (
        <div className={`relative h-32 bg-gradient-to-br ${meta.gradient} flex items-center justify-center overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full border border-white/5" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full border border-white/5" />
          <div className="absolute top-4 left-1/3 w-12 h-12 rounded-full bg-white/5" />
          <span className="text-4xl opacity-40 select-none">{meta.icon}</span>
        </div>
      )}

      {/* Category Badge */}
      {project.category && (
        <div className="px-5 pt-4 pb-0">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full border border-accent/15">
            {categoryLabel}
          </span>
        </div>
      )}

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-fg leading-relaxed line-clamp-4">
            {description}
          </p>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-medium bg-subtle text-muted-fg px-2 py-0.5 rounded-md border border-border"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-1">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-fg hover:text-accent transition-colors inline-flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              {t('github')}
            </a>
          )}

          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-fg hover:text-accent transition-colors inline-flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {t('live_demo')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}