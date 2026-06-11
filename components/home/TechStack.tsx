'use client'
import { useTranslations } from 'next-intl'

const techItems = [
  {
    key: 'agents',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    gradient: 'from-accent/20 via-accent/5 to-transparent',
    borderGlow: 'group-hover:border-accent/40',
    tags: ['Hermes Agent', 'Claude Code', 'Cowork', 'Multi-Agent'],
  },
  {
    key: 'ai',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 0 1 4-4z" />
        <path d="M2 22c0-5 4.5-8 10-8s10 3 10 8" />
        <path d="M17 6l2 2-2 2" />
        <path d="M21 8l-2 2-2-2" />
      </svg>
    ),
    gradient: 'from-violet-500/20 via-violet-500/5 to-transparent',
    borderGlow: 'group-hover:border-violet-500/40',
    tags: ['Gemma 4', 'Ollama Pro', 'Google AI Studio', 'OpenRouter'],
  },
  {
    key: 'data',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
    borderGlow: 'group-hover:border-blue-500/40',
    tags: ['Supabase', 'Firebase', 'PostgreSQL', 'Auth'],
  },
  {
    key: 'devops',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    borderGlow: 'group-hover:border-amber-500/40',
    tags: ['n8n', 'Docker', 'Hetzner VPS', 'GitHub Actions'],
  },
]

export default function TechStack() {
  const t = useTranslations('tech')

  return (
    <section className="relative overflow-hidden bg-card py-20 px-4">
      {/* Background grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id="tech-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tech-grid)" />
      </svg>

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            ⚡ {t('title')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('title')}
          </h2>
          <p className="text-muted-fg max-w-2xl mx-auto">
            {t('desc')}
          </p>
        </div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {techItems.map((item) => (
            <div
              key={item.key}
              className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${item.gradient} p-6 transition-all duration-300 ${item.borderGlow}`}
            >
              {/* Hover glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />

              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-subtle border border-border flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1.5">
                    {t(item.key + '_title')}
                  </h3>
                  <p className="text-sm text-muted-fg leading-relaxed">
                    {t(item.key + '_desc')}
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-subtle text-muted-fg font-medium border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}