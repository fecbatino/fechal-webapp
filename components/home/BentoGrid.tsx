'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { motion, type Variants } from 'framer-motion'
import { PenLine, Home, Briefcase, Plane, Handshake, ArrowRight, LucideIcon } from 'lucide-react'

/**
 * BentoGrid — UI-Modernisierung (2026-09-21)
 * Ersetzt das uniforme 5-Spalten-SectionCards-Grid durch ein asymmetrisches
 * Bento-Layout auf Basis des neuen Dark-Glassmorphism-Themes:
 *   .bento-card (Paper rgba(15,23,42,.75), Border 1px/8%, Radius 14px, blur 16px)
 *   Accent-Hover-Glow via CSS (.bento-card:hover in app/globals.css)
 * i18n: gleiche 'sections.*'-Keys wie SectionCards (alle 4 Sprachen intakt).
 */

type SectionKey = 'blog' | 'alltag' | 'portfolio' | 'hajj' | 'vereine'

const sections: Array<{
  key: SectionKey
  href: string
  icon: LucideIcon
  /** Bento-Spanning (Tailwind-Klassen) */
  span: string
  /** Größere Typo/Icon für breite Karten */
  featured?: boolean
}> = [
  { key: 'blog', href: '/blog', icon: PenLine, span: 'sm:col-span-2', featured: true },
  { key: 'alltag', href: '/alltag', icon: Home, span: '' },
  { key: 'portfolio', href: '/portfolio', icon: Briefcase, span: '' },
  { key: 'hajj', href: '/hajj-umrah', icon: Plane, span: 'lg:col-span-2', featured: true },
  { key: 'vereine', href: '/vereine', icon: Handshake, span: 'lg:col-span-2', featured: true },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 220, damping: 24 },
  },
}

export default function BentoGrid() {
  const t = useTranslations('sections')

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(150px,auto)]"
      >
        {sections.map(({ key, href, icon: Icon, span, featured }) => (
          <motion.div key={key} variants={item} className={span}>
            <Link
              href={href}
              className="bento-card group relative flex h-full flex-col justify-between overflow-hidden p-6"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex rounded-xl p-3 bg-accent-2/10 text-accent-2 ring-1 ring-accent-2/25">
                  <Icon className={featured ? 'w-7 h-7' : 'w-6 h-6'} strokeWidth={1.75} />
                </span>
                <ArrowRight
                  className="w-5 h-5 -translate-x-1 opacity-0 text-accent transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <h2
                  className={`font-semibold text-foreground group-hover:text-accent transition-colors ${
                    featured ? 'text-xl' : 'text-lg'
                  }`}
                >
                  {t(key)}
                </h2>
                <p className="text-sm text-muted-fg mt-1 line-clamp-2">{t(`${key}_desc`)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}