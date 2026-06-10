'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/lib/navigation'
import LanguageSwitcher from './LanguageSwitcher'
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
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoMark size={32} className="flex-shrink-0 transition-transform group-hover:scale-105" />
          <span className="font-bold text-gray-900 text-lg leading-none">
            Fechal
            <span className="block text-xs font-normal text-gray-400 tracking-wide">Batakpale</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-600 hover:text-emerald-600 text-sm font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <button
              onClick={handleLogout}
              className="hidden md:block text-sm text-red-500 hover:underline"
            >
              {t('logout')}
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:block text-sm text-emerald-600 hover:underline"
            >
              {t('login')}
            </Link>
          )}

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Menü"
          >
            <span className={`block h-0.5 w-5 bg-gray-700 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-2.5 px-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 text-sm font-medium"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left py-2.5 px-3 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium"
              >
                {t('logout')}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="block py-2.5 px-3 rounded-lg text-emerald-600 hover:bg-emerald-50 text-sm font-medium"
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
