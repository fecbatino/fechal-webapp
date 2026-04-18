'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(null)

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
    router.push(`/${locale}`)
  }

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/alltag`, label: t('alltag') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/hajj-umrah`, label: t('hajj') },
    { href: `/${locale}/vereine`, label: t('vereine') },
  ]

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-bold text-xl text-emerald-700">
          Fechal Batakpalé
        </Link>
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
              className="text-sm text-red-500 hover:underline"
            >
              {t('logout')}
            </button>
          ) : (
            <Link
              href={`/${locale}/auth/login`}
              className="text-sm text-emerald-600 hover:underline"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
