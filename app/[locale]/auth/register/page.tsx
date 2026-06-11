'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/lib/navigation'
import { createClient } from '@/lib/supabase/client'
import LogoMark from '@/components/ui/LogoMark'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogoMark size={56} className="shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('register_title')}</h1>
          <p className="text-subtle-fg text-sm mt-1">Fechal · Familie · Glaube · IT</p>
        </div>

        <div className="bg-card rounded-2xl border-border shadow-sm p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-muted mb-1">
                {t('full_name')}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted mb-1">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors font-semibold shadow-sm"
            >
              {loading ? '...' : t('submit_register')}
            </button>
          </form>

          <p className="text-center text-sm text-muted-fg mt-6">
            {t('has_account')}{' '}
            <Link href="/auth/login" className="text-emerald-600 hover:underline font-medium">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
