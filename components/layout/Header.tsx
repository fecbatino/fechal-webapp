'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/lib/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import LogoMark from '@/components/ui/LogoMark'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const t = useTranslations('nav')
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { email: session.user.email ?? '' } : null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email ?? '' } : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const navLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/alltag' as const, label: t('alltag') },
    { href: '/portfolio' as const, label: t('portfolio') },
    { href: '/hajj-umrah' as const, label: t('hajj') },
    { href: '/vereine' as const, label: t('vereine') },
  ]

  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoMark size={32} className="flex-shrink-0 transition-transform group-hover:scale-105" />
          <span className="font-bold text-foreground text-lg leading-none">
            Fechal
            <span className="block text-xs font-normal text-muted-fg tracking-wide">Batakpale</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-fg hover:text-foreground hover:bg-card transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          {user ? (
            <button
              onClick={handleLogout}
              className="hidden md:block text-sm text-red-400 hover:text-red-300 px-2"
            >
              {t('logout')}
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:block text-sm text-accent hover:text-accent-hover px-2"
            >
              {t('login')}
            </Link>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Menü"
          >
            <span className={`block h-0.5 w-5 bg-muted-fg transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-muted-fg transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-muted-fg transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-2.5 px-3 rounded-lg text-muted-fg hover:bg-accent-light hover:text-accent-hover text-sm font-medium transition-all"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-border mt-2 pt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left py-2.5 px-3 rounded-lg text-red-400 hover:bg-red-500/10 text-sm font-medium"
              >
                {t('logout')}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="block py-2.5 px-3 rounded-lg text-accent hover:bg-accent-light text-sm font-medium"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}