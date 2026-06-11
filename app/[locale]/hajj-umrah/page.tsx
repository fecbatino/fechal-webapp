import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { HAJJ_STEPS, UMRAH_STEPS, HAJJ_DUAS, PACKING_CHECKLIST, OFFICIAL_LINKS, HajjLocale } from '@/lib/hajj-data'
import HajjStepsGuide from '@/components/hajj/HajjStepsGuide'
import UmrahGuide from '@/components/hajj/UmrahGuide'
import DuaCollection from '@/components/hajj/DuaCollection'
import PackingChecklist from '@/components/hajj/PackingChecklist'
import { Compass, BookOpen, ClipboardList, Globe } from 'lucide-react'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hajj' })
  return {
    title: `${t('title')} | Fechal`,
    description: t('subtitle'),
  }
}

const sections = [
  { id: 'hajj-steps', titleKey: 'section_hajj', descKey: 'section_hajj_desc', icon: Compass },
  { id: 'umrah', titleKey: 'section_umrah', descKey: 'section_umrah_desc', icon: BookOpen },
  { id: 'duas', titleKey: 'section_duas', descKey: 'section_duas_desc', icon: BookOpen },
  { id: 'checklist', titleKey: 'section_checklist', descKey: 'section_checklist_desc', icon: ClipboardList },
]

export default async function HajjPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('hajj')

  const sectionContent: Record<string, React.ReactNode> = {
    'hajj-steps': <HajjStepsGuide steps={HAJJ_STEPS} />,
    'umrah': <UmrahGuide steps={UMRAH_STEPS} />,
    'duas': <DuaCollection duas={HAJJ_DUAS} />,
    'checklist': <PackingChecklist items={PACKING_CHECKLIST} />,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-7 h-7 text-accent" strokeWidth={1.5} />
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">
              {t('title')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{t('title')}</h1>
          <p className="text-muted-fg text-lg max-w-xl">{t('subtitle')}</p>
        </div>

        {/* Sections */}
        <div className="space-y-20">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <section key={section.id} id={section.id}>
                <div className="flex items-center gap-3 mb-8">
                  <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{t(section.titleKey)}</h2>
                    <p className="text-muted-fg text-sm">{t(section.descKey)}</p>
                  </div>
                </div>
                {sectionContent[section.id]}
              </section>
            )
          })}

          {/* Official Links */}
          <section id="links">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="w-5 h-5 text-accent" strokeWidth={1.5} />
              <div>
                <h2 className="text-2xl font-bold text-foreground">{t('section_links')}</h2>
                <p className="text-muted-fg text-sm">{t('section_links_desc')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OFFICIAL_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-5 flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm group-hover:text-accent transition-colors">
                      {link.title[locale as HajjLocale] ?? link.title.de}
                    </p>
                    <p className="text-xs text-muted-fg mt-0.5">
                      {link.country[locale as HajjLocale] ?? link.country.de}
                    </p>
                  </div>
                  <Globe className="text-accent flex-shrink-0 ml-3" size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}