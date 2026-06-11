import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { HAJJ_STEPS, UMRAH_STEPS, HAJJ_DUAS, PACKING_CHECKLIST, OFFICIAL_LINKS, HajjLocale } from '@/lib/hajj-data'
import HajjStepsGuide from '@/components/hajj/HajjStepsGuide'
import UmrahGuide from '@/components/hajj/UmrahGuide'
import DuaCollection from '@/components/hajj/DuaCollection'
import PackingChecklist from '@/components/hajj/PackingChecklist'

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

export default async function HajjPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('hajj')

  const sections = [
    { id: 'hajj-steps', titleKey: 'section_hajj', descKey: 'section_hajj_desc', content: <HajjStepsGuide steps={HAJJ_STEPS} /> },
    { id: 'umrah', titleKey: 'section_umrah', descKey: 'section_umrah_desc', content: <UmrahGuide steps={UMRAH_STEPS} /> },
    { id: 'duas', titleKey: 'section_duas', descKey: 'section_duas_desc', content: <DuaCollection duas={HAJJ_DUAS} /> },
    { id: 'checklist', titleKey: 'section_checklist', descKey: 'section_checklist_desc', content: <PackingChecklist items={PACKING_CHECKLIST} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 mb-3">
            🕋 {t('title')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('title')}</h1>
          <p className="text-gray-400 text-lg max-w-xl">{t('subtitle')}</p>
        </div>

        {/* Sections */}
        <div className="space-y-20">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{t(section.titleKey)}</h2>
                <p className="text-gray-400">{t(section.descKey)}</p>
              </div>
              {section.content}
            </section>
          ))}

          {/* Official Links */}
          <section id="links">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{t('section_links')}</h2>
              <p className="text-gray-400">{t('section_links_desc')}</p>
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
                    <p className="font-medium text-white text-sm group-hover:text-teal-400 transition-colors">
                      {link.title[locale as HajjLocale] ?? link.title.de}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {link.country[locale as HajjLocale] ?? link.country.de}
                    </p>
                  </div>
                  <svg className="text-teal-400 flex-shrink-0 ml-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}