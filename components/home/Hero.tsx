'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import LogoMark from '@/components/ui/LogoMark'

export default function Hero() {
  const t = useTranslations('home')
  const reduceMotion = useReducedMotion()

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
        }),
      }

  return (
    <section className="relative overflow-hidden bg-background py-28 px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }}>
        {/* Glowing orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse motion-reduce:animate-none" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-pulse motion-reduce:animate-none" style={{ animationDelay: '2s' }} />
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
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)' }} />
            <LogoMark size={80} className="relative" />
          </div>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight mb-2"
        >
          Fechal <span className="text-accent">Batakpale</span>
        </motion.h1>

        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          <span className="text-accent/80 text-xs">✦</span>
          <span className="h-px w-16 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        </motion.div>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-subtle-fg text-lg md:text-xl font-light max-w-xl mx-auto"
        >
          {t('hero_subtitle')}
        </motion.p>
      </div>
    </section>
  )
}
