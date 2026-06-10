import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

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
    color: 'emerald',
    icon: '🕌',
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
    color: 'blue',
    icon: '📚',
  },
]

const labels = {
  de: { role: 'Meine Rolle', activities: 'Tätigkeiten', contact: 'Kontakt aufnehmen' },
  fr: { role: 'Mon rôle', activities: 'Activités', contact: 'Prendre contact' },
  en: { role: 'My role', activities: 'Activities', contact: 'Get in touch' },
}

type Locale = 'de' | 'fr' | 'en'

export default async function VereinePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('sections')
  const l = (labels[locale as Locale] ?? labels.de)

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('vereine')}</h1>
        <p className="text-gray-500 text-lg">{t('vereine_desc')}</p>
      </div>

      <div className="space-y-8">
        {vereine.map((v) => (
          <div key={v.id} className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-4xl">{v.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{v.name}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {v.subtitle[locale as Locale] ?? v.subtitle.de}
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {v.description[locale as Locale] ?? v.description.de}
            </p>

            <div className="bg-gray-50 rounded-xl px-5 py-3 inline-block">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{l.role}</span>
              <p className="text-gray-800 font-semibold mt-0.5">
                {v.role[locale as Locale] ?? v.role.de}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
