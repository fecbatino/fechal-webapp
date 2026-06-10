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

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-500 text-lg">{t('subtitle')}</p>
      </div>

      <section className="mb-16" id="hajj-steps">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('section_hajj')}</h2>
        <p className="text-gray-500 mb-6">{t('section_hajj_desc')}</p>
        <HajjStepsGuide steps={HAJJ_STEPS} locale={locale} />
      </section>

      <hr className="border-gray-200 my-12" />

      <section className="mb-16" id="umrah">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('section_umrah')}</h2>
        <p className="text-gray-500 mb-6">{t('section_umrah_desc')}</p>
        <UmrahGuide steps={UMRAH_STEPS} locale={locale} />
      </section>

      <hr className="border-gray-200 my-12" />

      <section className="mb-16" id="duas">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('section_duas')}</h2>
        <p className="text-gray-500 mb-6">{t('section_duas_desc')}</p>
        <DuaCollection duas={HAJJ_DUAS} locale={locale} />
      </section>

      <hr className="border-gray-200 my-12" />

      <section className="mb-16" id="checklist">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('section_checklist')}</h2>
        <p className="text-gray-500 mb-6">{t('section_checklist_desc')}</p>
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <PackingChecklist items={PACKING_CHECKLIST} locale={locale} />
        </div>
      </section>

      <hr className="border-gray-200 my-12" />

      <section id="links">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('section_links')}</h2>
        <p className="text-gray-500 mb-6">{t('section_links_desc')}</p>
        <ul className="space-y-3">
          {OFFICIAL_LINKS.map((link) => (
            <li key={link.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">{link.title[locale as HajjLocale] ?? link.title.de}</p>
                <p className="text-xs text-gray-400 mt-0.5">{link.country[locale as HajjLocale] ?? link.country.de}</p>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
