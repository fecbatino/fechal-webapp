import { getTranslations } from 'next-intl/server'
import LogoMark from '@/components/ui/LogoMark'

const tags = [
  // Backend & Enterprise
  { label: 'Java Spring Boot', group: 'backend' },
  { label: 'Oracle DB', group: 'backend' },
  { label: 'PostgreSQL', group: 'backend' },
  { label: 'REST APIs', group: 'backend' },
  // Frontend & Web
  { label: 'React / Next.js 16', group: 'frontend' },
  { label: 'TypeScript', group: 'frontend' },
  { label: 'Tailwind CSS', group: 'frontend' },
  // KI & Agenten
  { label: 'Hermes Agent', group: 'ai' },
  { label: 'Claude Code', group: 'ai' },
  { label: 'Ollama / Gemma 4', group: 'ai' },
  { label: 'OpenRouter', group: 'ai' },
  { label: 'n8n', group: 'ai' },
  // DevOps & Infra
  { label: 'Docker / Compose', group: 'devops' },
  { label: 'CI/CD (GitHub Actions)', group: 'devops' },
  { label: 'Hetzner Cloud', group: 'devops' },
  { label: 'Nginx PM', group: 'devops' },
  // Daten & Auth
  { label: 'Supabase', group: 'data' },
  { label: 'Firebase', group: 'data' },
  { label: 'Ghost CMS', group: 'data' },
  // Community & Bildung
  { label: 'AIKF e.V.', group: 'community' },
  { label: 'UMTA e.V.', group: 'community' },
  { label: 'Arabisch', group: 'community' },
  { label: 'Islamische Bildung', group: 'community' },
]

const groupColors: Record<string, string> = {
  backend: 'bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20',
  frontend: 'bg-teal-500/10 border-teal-500/20 text-teal-300 hover:bg-teal-500/20',
  ai: 'bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/20',
  devops: 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20',
  data: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20',
  community: 'bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500/20',
}

const groupLabels: Record<string, string> = {
  backend: 'Backend & Enterprise',
  frontend: 'Frontend & UI',
  ai: 'KI & Agenten',
  devops: 'DevOps & Infrastructure',
  data: 'Daten & CMS',
  community: 'Community & Bildung',
}

export default async function AboutSection() {
  const t = await getTranslations('home')

  // Group tags
  const grouped = tags.reduce<Record<string, typeof tags>>((acc, tag) => {
    if (!acc[tag.group]) acc[tag.group] = []
    acc[tag.group].push(tag)
    return acc
  }, {})

  return (
    <section className="bg-gray-950 py-20 px-4 border-t border-white/5" id="ueber-mich">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 rounded-xl blur-md" />
            <LogoMark size={48} className="relative" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{t('about_title')}</h2>
            <p className="text-teal-400 text-sm font-medium mt-0.5">Software Engineer · Nürnberg</p>
          </div>
        </div>

        {/* Bio paragraphs */}
        <div className="space-y-4 text-gray-300 leading-relaxed mb-10">
          <p>{t('about_bio_1')}</p>
          <p>{t('about_bio_2')}</p>
          <p>{t('about_bio_3')}</p>
        </div>

        {/* Tags by group */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-5">
            {t('about_focus')}
          </p>
          <div className="space-y-4">
            {Object.entries(groupLabels).map(([group, label]) => {
              const groupTags = grouped[group]
              if (!groupTags) return null
              return (
                <div key={group}>
                  <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-2">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {groupTags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${groupColors[group]}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}