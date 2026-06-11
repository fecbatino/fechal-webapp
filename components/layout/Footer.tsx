import Link from 'next/link'
import { MessageCircle, Code, Camera, Music, Video } from 'lucide-react'

const socialLinks = [
  {
    href: 'https://github.com/fecbatino',
    label: 'GitHub',
    icon: Code,
    color: 'hover:text-foreground hover:border-accent/40',
  },
  {
    href: 'https://www.instagram.com/fecbatino',
    label: 'Instagram',
    icon: Camera,
    color: 'hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-500/10',
  },
  {
    href: 'https://www.tiktok.com/@fecbatino',
    label: 'TikTok',
    icon: Music,
    color: 'hover:text-foreground hover:border-accent/40',
  },
  {
    href: 'https://www.youtube.com/@fecbatino',
    label: 'YouTube',
    icon: Video,
    color: 'hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10',
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top row: copyright + legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <span className="text-sm text-muted-fg">
            © {new Date().getFullYear()} Fechal Batakpale
          </span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/impressum" className="text-muted-fg hover:text-accent transition-colors">
              Impressum
            </Link>
            <span className="text-muted">·</span>
            <Link href="/datenschutz" className="text-muted-fg hover:text-accent transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>

        {/* Bottom row: social icons */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
          {socialLinks.map(({ href, label, icon: Icon, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-9 h-9 rounded-lg border border-border bg-subtle flex items-center justify-center text-muted-fg transition-all ${color}`}
              aria-label={label}
            >
              <Icon size={16} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}