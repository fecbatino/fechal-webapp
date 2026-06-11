'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useFamily } from '@/lib/family-context'
import { Link } from '@/lib/navigation'

export default function FamiliePage() {
  const t = useTranslations('familie')
  const s = useTranslations('sections')
  const { familyId, family, members, loading, create, join, leave, disband, regenerateCode } = useFamily()
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setError(null)
    const result = await create(name.trim())
    if (!result.ok) setError(result.error ?? 'Fehler')
    setBusy(false)
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setBusy(true)
    setError(null)
    const result = await join(code.trim())
    if (!result.ok) setError(result.error ?? 'Fehler')
    setBusy(false)
  }

  // No family – show create/join
  if (!familyId && !loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('title')}</h1>
        <p className="text-muted-fg mb-8">{s('familie_desc')}</p>

        {error && (
          <div className="text-sm text-red-500 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">{error}</div>
        )}

        {/* Create family */}
        {!showJoin && (
          <div className="glass-card rounded-2xl p-6 mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('create_title')}</h2>
            {showCreate ? (
              <form onSubmit={handleCreate} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('create_placeholder')}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={busy || !name.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {busy ? '…' : t('create_submit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setError(null); setName('') }}
                    className="px-4 py-2.5 rounded-xl border border-border text-muted-fg text-sm hover:bg-subtle transition-colors"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => { setShowCreate(true); setShowJoin(false); setError(null) }}
                className="w-full py-3 rounded-xl bg-accent-light border border-accent/20 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
              >
                {t('create_btn')}
              </button>
            )}
          </div>
        )}

        {/* Join family */}
        {!showCreate && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('join_title')}</h2>
            {showJoin ? (
              <form onSubmit={handleJoin} className="space-y-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('join_placeholder')}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm uppercase tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                  maxLength={6}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={busy || code.trim().length < 4}
                    className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {busy ? '…' : t('join_submit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowJoin(false); setError(null); setCode('') }}
                    className="px-4 py-2.5 rounded-xl border border-border text-muted-fg text-sm hover:bg-subtle transition-colors"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => { setShowJoin(true); setShowCreate(false); setError(null) }}
                className="w-full py-3 rounded-xl bg-subtle border border-border text-foreground text-sm font-medium hover:bg-card transition-colors"
              >
                {t('join_btn')}
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-muted-fg text-center mt-6">{t('no_family_hint')}</p>
      </div>
    )
  }

  if (loading) {
    return <div className="max-w-lg mx-auto px-4 py-12 text-center text-muted-fg animate-pulse">…</div>
  }

  // Has family – show manage link + overview
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">{family?.name ?? t('title')}</h1>
      </div>
      <p className="text-muted-fg mb-8">{t('member_count', { count: members.length })}</p>

      {/* Quick links to sub-pages */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link href="/alltag/familie/kalender" className="glass-card rounded-xl p-4 text-center hover:border-accent transition-all">
          <span className="text-2xl">📅</span>
          <p className="text-sm font-medium text-foreground mt-1">{t('kalender')}</p>
        </Link>
        <Link href="/alltag/familie/aufgaben" className="glass-card rounded-xl p-4 text-center hover:border-accent transition-all">
          <span className="text-2xl">✅</span>
          <p className="text-sm font-medium text-foreground mt-1">{t('aufgaben')}</p>
        </Link>
        <Link href="/alltag/familie/notizen" className="glass-card rounded-xl p-4 text-center hover:border-accent transition-all">
          <span className="text-2xl">📝</span>
          <p className="text-sm font-medium text-foreground mt-1">{t('notizen')}</p>
        </Link>
        <Link href="/alltag/familie/mitglieder" className="glass-card rounded-xl p-4 text-center hover:border-accent transition-all">
          <span className="text-2xl">👤</span>
          <p className="text-sm font-medium text-foreground mt-1">{t('mitglieder')}</p>
        </Link>
      </div>

      {/* Family manage */}
      <Link
        href="/alltag/familie/verwaltung"
        className="block w-full py-3 rounded-xl bg-accent-light border border-accent/20 text-accent text-sm font-medium text-center hover:bg-accent/20 transition-colors"
      >
        ⚙️ {t('manage_title')}
      </Link>
    </div>
  )
}