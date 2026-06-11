import { getTranslations } from 'next-intl/server'
import LogoMark from '@/components/ui/LogoMark'
import { Mail, MessageCircle, Code, Camera, Music, Video } from 'lucide-react'

const socialItems = [
  {
    href: 'https://github.com/fecbatino',
    label: 'GitHub',
    icon: Code,
    btnColor: 'hover:bg-white/10 hover:text-white hover:border-white/20',
    iconColor: 'text-gray-400',
  },
  {
    href: 'https://www.instagram.com/fecbatino',
    label: 'Instagram',
    icon: Camera,
    btnColor: 'hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30',
    iconColor: 'text-gray-400',
  },
  {
    href: 'https://www.tiktok.com/@fecbatino',
    label: 'TikTok',
    icon: Music,
    btnColor: 'hover:bg-white/10 hover:text-white hover:border-white/20',
    iconColor: 'text-gray-400',
  },
  {
    href: 'https://www.youtube.com/@fecbatino',
    label: 'YouTube',
    icon: Video,
    btnColor: 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30',
    iconColor: 'text-gray-400',
  },
]

export default async function ContactSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-gray-950 border-t border-white/5 py-20 px-4" id="kontakt">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 mb-3">
            ✦ {t('contact_title')}
          </span>
          <p className="text-gray-400 max-w-xl">{t('contact_desc')}</p>
        </div>

        {/* Contact card */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400" />

          <div className="p-8">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-teal-500/20 rounded-xl blur-md" />
                <LogoMark size={64} className="relative" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-gray-950" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Fechal Batakpale</h3>
                <p className="text-teal-400 font-medium text-sm mt-0.5">Software Engineer · KI · Islamische Bildung</p>
                <p className="text-gray-500 text-xs mt-1">Nürnberg, Deutschland</p>
              </div>
            </div>

            {/* Contact & CTA grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <a
                href="mailto:fecbatino@gmail.com"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 transition-all group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 flex-shrink-0">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">E-Mail</p>
                  <p className="text-sm text-gray-300 font-medium truncate group-hover:text-teal-400">fecbatino@gmail.com</p>
                </div>
              </a>

              <a
                href="https://www.umta.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 transition-all group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 flex-shrink-0 text-base">
                  🕌
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">UMTA e.V.</p>
                  <p className="text-sm text-gray-300 font-medium group-hover:text-teal-400">IT-Verantwortlicher & Webmaster</p>
                </div>
              </a>

              <a
                href="mailto:fecbatino@gmail.com"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10 transition-all group"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-600 text-white flex-shrink-0">
                  <MessageCircle size={16} strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-xs text-teal-400 font-medium uppercase tracking-wide">{t('contact')}</p>
                  <p className="text-sm text-teal-300 font-semibold group-hover:text-teal-200">{t('contact_cta')}</p>
                </div>
              </a>
            </div>

            {/* Social Media row */}
            <div className="border-t border-white/5 pt-5">
              <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-3">
                Social Media
              </p>
              <div className="flex flex-wrap gap-2">
                {socialItems.map(({ href, label, icon: Icon, btnColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/5 transition-all ${btnColor}`}
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