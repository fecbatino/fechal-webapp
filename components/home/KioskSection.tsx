import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'

const features = ['kiosk_feature_1', 'kiosk_feature_2', 'kiosk_feature_3'] as const

const featureIcons = [
  // Automation / gears
  <svg key="f1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>,
  // Receipt / document
  <svg key="f2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>,
  // Bar chart
  <svg key="f3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>,
]

interface Props {
  locale: string
}

export default async function KioskSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'kiosk' })

  return (
    <section className="relative overflow-hidden bg-background py-20 px-4 border-t border-border">
      {/* Decorative side accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16">
          {/* Left: icon / visual block */}
          <div className="flex-shrink-0 w-full lg:w-80">
            <div className="relative">
              {/* Decorative hexagon / abstract shape */}
              <svg className="w-full h-auto" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background glass card shape */}
                <rect x="20" y="20" width="280" height="200" rx="24" fill="rgba(20,184,166,0.05)" stroke="rgba(20,184,166,0.2)" strokeWidth="1" />
                {/* Decorative circle */}
                <circle cx="160" cy="120" r="60" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.2)" strokeWidth="1" />
                <circle cx="160" cy="120" r="35" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.3)" strokeWidth="1" />
                {/* Arabic pattern calligraphy hint */}
                <text x="160" y="132" textAnchor="middle" fill="rgba(20,184,166,0.5)" fontSize="40" fontFamily="'Amiri', serif">
                  ك
                </text>
                {/* Small dots */}
                <circle cx="80" cy="60" r="3" fill="rgba(20,184,166,0.3)" />
                <circle cx="240" cy="180" r="3" fill="rgba(20,184,166,0.3)" />
                <circle cx="240" cy="60" r="2" fill="rgba(20,184,166,0.2)" />
                <circle cx="80" cy="180" r="2" fill="rgba(20,184,166,0.2)" />
              </svg>
            </div>
          </div>

          {/* Right: content */}
          <div className="flex-1 min-w-0">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-3">
              🏪 {t('kiosk_title')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('kiosk_title')}
            </h2>
            <p className="text-muted-fg max-w-xl mb-8">
              {t('kiosk_desc')}
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-8">
              {features.map((featKey, i) => (
                <div key={featKey} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-accent-light border border-accent/20 flex items-center justify-center flex-shrink-0">
                    {featureIcons[i]}
                  </span>
                  <p className="text-sm text-subtle-fg pt-1.5">
                    {t(featKey)}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/vereine"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-light border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/50 transition-all text-sm font-medium"
            >
              {t('kiosk_cta')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}