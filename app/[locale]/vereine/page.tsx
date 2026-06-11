import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import LogoMark from '@/components/ui/LogoMark'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sections' })
  return {
    title: `${t('vereine')} | Fechal`,
    description: t('vereine_desc'),
  }
}

const vereine = [
  {
    id: 'umta',
    name: 'UMTA e.V.',
    subtitle: {
      de: 'Union der Togoischen Muslime in Deutschland',
      fr: 'Union des Musulmans Togolais en Allemagne',
      en: 'Union of Togolese Muslims in Germany',
    },
    description: {
      de: 'Kulturelle und religiöse Gemeinschaft der togolesischen Muslim-Diaspora in Deutschland. Engagement für Bildung, Integration und Zusammenhalt.',
      fr: 'Communauté culturelle et religieuse de la diaspora musulmane togolaise en Allemagne. Engagement pour l\'éducation, l\'intégration et la cohésion.',
      en: 'Cultural and religious community of the Togolese Muslim diaspora in Germany. Committed to education, integration and community cohesion.',
    },
    role: {
      de: 'IT-Verantwortlicher & Webmaster',
      fr: 'Responsable informatique & Webmaster',
      en: 'IT Officer & Webmaster',
    },
    accent: 'teal',
  },
  {
    id: 'aikf',
    name: 'AIKF e.V.',
    subtitle: {
      de: 'Afrikanisch-Islamische Kultur- und Fördergesellschaft',
      fr: 'Association Islamique Africaine de Culture et de Promotion',
      en: 'African Islamic Culture and Promotion Association',
    },
    description: {
      de: 'Förderung der islamischen Kultur und Werte innerhalb der afrikanischen Gemeinschaft. Bildungsangebote, Jugendarbeit und soziale Projekte.',
      fr: 'Promotion de la culture et des valeurs islamiques au sein de la communauté africaine. Offres éducatives, travail avec les jeunes et projets sociaux.',
      en: 'Promoting Islamic culture and values within the African community. Educational offers, youth work and social projects.',
    },
    role: {
      de: 'Mitglied & IT-Unterstützung',
      fr: 'Membre & Support informatique',
      en: 'Member & IT Support',
    },
    accent: 'emerald',
  },
]

const labels = {
  de: { role: 'Meine Rolle', activities: 'Tätigkeiten', contact: 'Kontakt aufnehmen' },
  fr: { role: 'Mon rôle', activities: 'Activités', contact: 'Prendre contact' },
  en: { role: 'My role', activities: 'Activities', contact: 'Get in touch' },
}

type Locale = 'de' | 'fr' | 'en'

const accentStyles: Record<string, { badge: string; border: string; text: string }> = {
  teal: { badge: 'bg-teal-500/10 border-teal-500/20 text-teal-400', border: 'hover:border-teal-500/40', text: 'text-teal-400' },
  emerald: { badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', border: 'hover:border-emerald-500/40', text: 'text-emerald-400' },
}

export default async function VereinePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('sections')
  const l = (labels[locale as Locale] ?? labels.de)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 mb-3">
            🤝 {t('vereine')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('vereine')}</h1>
          <p className="text-gray-400 text-lg max-w-xl">{t('vereine_desc')}</p>
        </div>

        <div className="space-y-8">
          {vereine.map((v) => {
            const accent = accentStyles[v.accent]
            return (
              <div
                key={v.id}
                className={`glass-card rounded-2xl p-8 transition-all ${accent.border}`}
              >
                <div className="flex items-start gap-5 mb-6">
                  {/* Logo placeholder */}
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <LogoMark size={36} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{v.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {v.subtitle[locale as Locale] ?? v.subtitle.de}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  {v.description[locale as Locale] ?? v.description.de}
                </p>

                {/* Role badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${accent.badge}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{l.role}</p>
                    <p className="text-sm font-medium">{v.role[locale as Locale] ?? v.role.de}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}