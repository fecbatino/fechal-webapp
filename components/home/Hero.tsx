import { getTranslations } from 'next-intl/server'
import LogoMark from '@/components/ui/LogoMark'

export default async function Hero() {
  const t = await getTranslations('home')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 py-24 px-4">
      {/* Subtle geometric background pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Decorative arcs */}
      <svg
        className="absolute -right-16 -top-16 w-64 h-64 text-white opacity-5 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="2" />
      </svg>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Logo mark */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <LogoMark size={72} className="shadow-2xl" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M5 1 L6.2 3.8 L9 4.1 L7 6 L7.6 9 L5 7.5 L2.4 9 L3 6 L1 4.1 L3.8 3.8 Z" fill="white" />
              </svg>
            </span>
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-1">
          Fechal
        </h1>
        <p className="text-emerald-200 text-sm font-medium tracking-widest uppercase mb-6">
          Batakpale
        </p>

        {/* Separator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-12 bg-emerald-400/60" />
          <span className="text-emerald-300 text-xs">✦</span>
          <span className="h-px w-12 bg-emerald-400/60" />
        </div>

        {/* Tagline */}
        <p className="text-emerald-100 text-lg font-medium">
          {t('hero_subtitle')}
        </p>
      </div>
    </section>
  )
}
