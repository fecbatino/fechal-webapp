import { getTranslations } from 'next-intl/server'
import LogoMark from '@/components/ui/LogoMark'
import { Mail, MessageCircle, Code, Camera, Music, Video } from 'lucide-react'

const socialItems = [
  {
    href: 'https://github.com/fecbatino',
    label: 'GitHub',
    icon: Code,
    btnColor: 'hover:bg-card hover:text-foreground hover:border-border',
    iconColor: 'text-muted-fg',
  },
  {
    href: 'https://www.instagram.com/fecbatino',
    label: 'Instagram',
    icon: Camera,
    btnColor: 'hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30',
    iconColor: 'text-muted-fg',
  },
  {
    href: 'https://www.tiktok.com/@fecbatino',
    label: 'TikTok',
    icon: Music,
    btnColor: 'hover:bg-card hover:text-foreground hover:border-border',
    iconColor: 'text-muted-fg',
  },
  {
    href: 'https://www.youtube.com/@fecbatino',
    label: 'YouTube',
    icon: Video,
    btnColor: 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30',
    iconColor: 'text-muted-fg',
  },
]

export default async function ContactSection() {
  const t = await getTranslations('home')

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
                <p className="text-muted-fg text-xs mt-1">Nürnberg, Deutschland</p>
              </div>
            </div>

            {/* Contact & CTA grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <a
                href="mailto:fecbatino@gmail.com"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-accent/30 hover:bg-accent/5 transition-all group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-light text-accent flex-shrink-0">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-fg font-medium uppercase tracking-wide">E-Mail</p>
                  <p className="text-sm text-subtle-fg font-medium truncate group-hover:text-accent">fecbatino@gmail.com</p>
                </div>
              </a>

              <a
                href="https://www.umta.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-accent/30 hover:bg-accent/5 transition-all group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-light text-accent flex-shrink-0 text-base">
                  🕌
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-fg font-medium uppercase tracking-wide">UMTA e.V.</p>
                  <p className="text-sm text-subtle-fg font-medium group-hover:text-accent">IT-Verantwortlicher & Webmaster</p>
                </div>
              </a>

              <a
                href="mailto:fecbatino@gmail.com"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-600 text-foreground flex-shrink-0">
                  <MessageCircle size={16} strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-xs text-accent font-medium uppercase tracking-wide">{t('contact')}</p>
                  <p className="text-sm text-accent-hover font-semibold group-hover:text-teal-200">{t('contact_cta')}</p>
                </div>
              </a>
            </div>

            {/* Social Media row */}
            <div className="border-t border-border pt-5">
              <p className="text-[10px] font-medium text-muted uppercase tracking-wider mb-3">
                Social Media
              </p>
              <div className="flex flex-wrap gap-2">
                {socialItems.map(({ href, label, icon: Icon, btnColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border transition-all ${btnColor}`}
                    aria-label={label}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    <span className="text-xs font-medium">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}