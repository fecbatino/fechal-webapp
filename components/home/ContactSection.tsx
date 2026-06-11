import { getTranslations } from 'next-intl/server'
import LogoMark from '@/components/ui/LogoMark'

export default async function ContactSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-gray-50 border-t border-gray-100 py-16 px-4" id="kontakt">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('contact_title')}</h2>
        <p className="text-gray-500 mb-10">{t('contact_desc')}</p>

        {/* Contact card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card header strip */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400" />

          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <LogoMark size={64} />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
              </div>

              {/* Name & title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900">Fechal Batakpale</h3>
                <p className="text-emerald-600 font-medium text-sm mt-0.5">Software Engineer · KI · Islamische Bildung</p>
                <p className="text-gray-400 text-xs mt-1">Nürnberg, Deutschland</p>
              </div>
            </div>

            {/* Contact links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="mailto:fecbatino@gmail.com"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">E-Mail</p>
                  <p className="text-sm text-gray-700 font-medium truncate group-hover:text-emerald-700">fecbatino@gmail.com</p>
                </div>
              </a>

              <a
                href="https://github.com/fecbatino"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">GitHub</p>
                  <p className="text-sm text-gray-700 font-medium group-hover:text-gray-900">github.com/fecbatino</p>
                </div>
              </a>

              <a
                href="https://www.umta.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0 text-base">
                  🕌
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">UMTA e.V.</p>
                  <p className="text-sm text-gray-700 font-medium group-hover:text-emerald-700">IT-Verantwortlicher & Webmaster</p>
                </div>
              </a>

              <a
                href="mailto:fecbatino@gmail.com"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-600 text-white flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">{t('contact')}</p>
                  <p className="text-sm text-emerald-700 font-semibold">{t('contact_cta')}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
