'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { motion, type Variants } from 'framer-motion'
import { PenLine, Home, Briefcase, Plane, Handshake, LucideIcon } from 'lucide-react'

const sections: Array<{
  key: 'blog' | 'alltag' | 'portfolio' | 'hajj' | 'vereine'
  href: string
  icon: LucideIcon
  accent: string
}> = [
  { key: 'blog', href: '/blog', icon: PenLine, accent: 'from-cyan-500/20 to-sky-500/5 text-cyan-400' },
  { key: 'alltag', href: '/alltag', icon: Home, accent: 'from-emerald-500/20 to-teal-500/5 text-emerald-400' },
  { key: 'portfolio', href: '/portfolio', icon: Briefcase, accent: 'from-violet-500/20 to-purple-500/5 text-violet-400' },
  { key: 'hajj', href: '/hajj-umrah', icon: Plane, accent: 'from-amber-500/20 to-orange-500/5 text-amber-400' },
  { key: 'vereine', href: '/vereine', icon: Handshake, accent: 'from-rose-500/20 to-pink-500/5 text-rose-400' },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 220, damping: 24 },
  },
}

export default function SectionCards() {
  const t = useTranslations('sections')

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
      >
        {sections.map(({ key, href, icon: Icon, accent }) => (
          <motion.div key={key} variants={item}>
            <Link
              href={href}
              className="group relative block p-6 h-full rounded-2xl border border-border bg-card hover:shadow-xl transition-shadow overflow-hidden"
            >
              {/* accent glow on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${accent.split(' ').slice(0, 2).join(' ')} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className={`relative inline-flex rounded-xl p-3 ${accent} bg-gradient-to-br`}>
                <Icon className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h2 className="relative mt-4 font-semibold text-foreground group-hover:text-accent transition-colors">
                {t(key)}
              </h2>
              <p className="relative text-sm text-muted-fg mt-1">{t(`${key}_desc`)}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
