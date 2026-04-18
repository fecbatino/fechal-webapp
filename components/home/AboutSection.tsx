import { useTranslations } from 'next-intl'

const interests = ['Familie', 'Glaube', 'Bildung', 'IT', 'KI', 'Koran', 'Arabisch']

export default function AboutSection() {
  const t = useTranslations('home')

  return (
    <section className="max-w-3xl mx-auto px-4 py-16" id="ueber-mich">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about_title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-8">{t('about_bio')}</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {interests.map((interest) => (
          <span
            key={interest}
            className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
          >
            {interest}
          </span>
        ))}
      </div>
      <a
        href="mailto:fecbatino@gmail.com"
        className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
      >
        {t('contact')}
      </a>
    </section>
  )
}
