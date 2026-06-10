import { getTranslations } from 'next-intl/server'
import LogoMark from '@/components/ui/LogoMark'

const tags = [
  { label: 'Java Spring Boot', group: 'tech' },
  { label: 'React', group: 'tech' },
  { label: 'Oracle DB', group: 'tech' },
  { label: 'n8n', group: 'auto' },
  { label: 'KI-Agenten', group: 'auto' },
  { label: 'Islamische Bildung', group: 'community' },
  { label: 'UMTA e.V.', group: 'community' },
  { label: 'AIKF e.V.', group: 'community' },
  { label: 'Arabisch', group: 'community' },
]

const groupColors: Record<string, string> = {
  tech: 'bg-blue-50 text-blue-700 border-blue-100',
  auto: 'bg-violet-50 text-violet-700 border-violet-100',
  community: 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

export default async function AboutSection() {
  const t = await getTranslations('home')

  return (
    <section className="max-w-3xl mx-auto px-4 py-16" id="ueber-mich">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <LogoMark size={40} />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t('about_title')}</h2>
          <p className="text-emerald-600 text-sm font-medium mt-0.5">Software Engineer · Nürnberg</p>
        </div>
      </div>

      {/* Bio paragraphs */}
      <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
        <p>{t('about_bio_1')}</p>
        <p>{t('about_bio_2')}</p>
        <p>{t('about_bio_3')}</p>
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {t('about_focus')}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${groupColors[tag.group]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
