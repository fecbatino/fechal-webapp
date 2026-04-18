import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('home')

  return (
    <section className="bg-gradient-to-br from-emerald-50 to-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-28 h-28 rounded-full bg-emerald-100 mx-auto mb-6 flex items-center justify-center text-5xl">
          🌙
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('hero_title')}</h1>
        <p className="text-lg text-emerald-700 font-medium">{t('hero_subtitle')}</p>
      </div>
    </section>
  )
}
