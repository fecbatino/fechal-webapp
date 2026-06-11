import { getTranslations } from 'next-intl/server'
import LogoMark from '@/components/ui/LogoMark'
import { Mail, MessageCircle, Code, Camera, Music, Video } from 'lucide-react'

export default async function ContactSection() {
  const t = await getTranslations('home')
  const s = await getTranslations('social')

  const socialItems = [
    {
      href: s('github_url'),
      label: s('github_label'),
      icon: Code,
      btnColor: 'hover:bg-card hover:text-foreground hover:border-border',
      iconColor: 'text-muted-fg',
    },
    {
      href: s('instagram_url'),
      label: s('instagram_label'),
      icon: Camera,
      btnColor: 'hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30',
      iconColor: 'text-muted-fg',
    },
    {
      href: s('tiktok_url'),
      label: s('tiktok_label'),
      icon: Music,
      btnColor: 'hover:bg-card hover:text-foreground hover:border-border',
      iconColor: 'text-muted-fg',
    },
    {
      href: s('youtube_url'),
      label: s('youtube_label'),
      icon: Video,
      btnColor: 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30',
      iconColor: 'text-muted-fg',
    },
  ]

  return (
    <section className="bg-background border-t border-border py-20 px-4" id="kontakt">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            ✦ {t('contact_title')}
          </span>
          <p className="text-muted-fg max-w-xl">{t('contact_desc')}</p>
        </div>

        {/* Contact card */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400" />

          <div className="p-8">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl blur-md" style={{background: 'color-mix(in srgb, var(--accent) 20%, transparent)'}} />
                <LogoMark size={64} className="relative" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-background" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Fechal Batakpale</h3>
                <p className="text-accent font-medium text-sm mt-0.5">Software Engineer · KI · Islamische Bildung</p>
              </div>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {socialItems.map(({ href, label, icon: Icon, btnColor, iconColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl border border-border
                    bg-subtle transition-all ${btnColor}
                  `}
                  aria-label={label}
                >
                  <Icon size={22} strokeWidth={1.5} className={iconColor} />
                  <span className="text-xs font-medium text-muted-fg">{label}</span>
                </a>
              ))}
            </div>

            {/* CTA */}
            <a
              href="mailto:fecbatino@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-light border border-accent/20 text-accent hover:bg-accent/20 transition-all text-sm font-medium"
            >
              <MessageCircle size={16} strokeWidth={1.5} />
              {t('contact_cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}