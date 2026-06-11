import { getTranslations } from 'next-intl/server'
import LogoMark from '@/components/ui/LogoMark'

export default async function Hero() {
  const t = await getTranslations('home')

  return (
    <section className="relative overflow-hidden bg-background py-28 px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0" style={{background: 'var(--gradient-hero)'}}>
        {/* Glowing orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{background: 'color-mix(in srgb, var(--accent) 20%, transparent)'}} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Logo mark with glow */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl" style={{background: 'color-mix(in srgb, var(--accent) 20%, transparent)'}} />
            <LogoMark size={80} className="relative shadow-2xl" />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight mb-2">
          Fechal
        </h1>
        <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">
          Batakpale
        </p>

        {/* Separator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-16 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          <span className="text-accent/80 text-xs">✦</span>
          <span className="h-px w-16 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        </div>

        {/* Tagline */}
        <p className="text-subtle-fg text-lg md:text-xl font-light max-w-xl mx-auto">
          {t('hero_subtitle')}
        </p>

        {/* Subtle bottom fade */}
        <div className="absolute -bottom-20 left-0 right-0 h-20" style={{background: 'linear-gradient(to top, var(--background), transparent)'}} />
      </div>
    </section>
  )
}