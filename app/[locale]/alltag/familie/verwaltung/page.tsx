'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useFamily } from '@/lib/family-context'
import { FamilyRole } from '@/lib/types'
import { Link } from '@/lib/navigation'
import { createClient } from '@/lib/supabase/client'

const ROLE_ICONS: Record<FamilyRole, string> = {
  parent: '👨‍👩‍👧',
  child: '🧒',
  member: '👤',
}

const ROLE_OPTIONS: FamilyRole[] = ['parent', 'child', 'member']

export default function FamilienVerwaltungPage() {
  const t = useTranslations('familie')
  const { family, members, loading, regenerateCode, updateRole, remove, disband } = useFamily()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updatingMember, setUpdatingMember] = useState<string | null>(null)
  const [removingMember, setRemovingMember] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUserId(data.user.id)
    })
  }, [])

  const currentMember = members.find((m) => m.id === currentUserId)
  const isParent = currentMember?.family_role === 'parent'

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="glass-card rounded-2xl p-6 border border-border text-center text-muted-fg">
          …
        </div>
      </div>
    )
  }

  if (!family) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="glass-card rounded-2xl p-6 border border-border text-center text-muted-fg">
          {t('family_id_missing')}
        </div>
      </div>
    )
  }

  const handleCopy = async () => {
    if (!family.invite_code) return
    try {
      await navigator.clipboard.writeText(family.invite_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = family.invite_code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRegenerate = async () => {
    setRegenerating(true)
    setError(null)
    const res = await regenerateCode()
    if (!res.ok) setError(res.error ?? t('manage_delete'))
    setRegenerating(false)
  }

  const handleRoleChange = async (memberId: string, role: string) => {
    setUpdatingMember(memberId)
    setError(null)
    const res = await updateRole(memberId, role as FamilyRole)
    if (!res.ok) setError(res.error ?? t('manage_delete'))
    setUpdatingMember(null)
  }

  const handleRemove = async (memberId: string) => {
    setRemovingMember(memberId)
    setError(null)
    const res = await remove(memberId)
    if (!res.ok) setError(res.error ?? t('manage_delete'))
    setRemovingMember(null)
  }

  const handleDisband = async () => {
    setDeleting(true)
    setError(null)
    const res = await disband()
    if (!res.ok) setError(res.error ?? t('manage_delete'))
    setDeleting(false)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Back link */}
      <Link
        href="/alltag/familie"
        className="inline-flex items-center gap-2 text-sm text-muted-fg hover:text-foreground transition-colors"
      >
        ← {t('manage_back')}
      </Link>

      <h1 className="text-2xl font-bold text-foreground">{t('manage_title')}</h1>

      {/* Error toast */}
      {error && (
        <div className="glass-card rounded-2xl p-4 border border-red-500/40 bg-red-500/10 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Family Info Card */}
      <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{family.name}</h2>
        <p className="text-sm text-muted-fg">
          {t('member_count', { count: members.length })}
        </p>

        {/* Invite Code – nur für Eltern sichtbar */}
        {isParent && family.invite_code && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {t('manage_code')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={family.invite_code}
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-mono select-all"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors whitespace-nowrap"
              >
                {copied ? t('manage_copied') : t('manage_copy')}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-background/80 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {regenerating ? '…' : t('manage_regenerate')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t('manage_members')} ({members.length})
        </h2>

        {members.length === 0 ? (
          <p className="text-sm text-muted-fg">—</p>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background/50"
              >
                {/* Icon + Name */}
                <span className="text-xl shrink-0">{ROLE_ICONS[m.family_role]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {m.full_name || m.email}
                  </p>
                  <p className="text-xs text-muted-fg truncate">{m.email}</p>
                </div>

                {/* Role – als Badge für alle sichtbar */}
                <span className="shrink-0 text-xs text-muted-fg bg-background px-2.5 py-1 rounded-lg border border-border">
                  {t(`role_${m.family_role}`)}
                </span>

                {/* Role dropdown – nur für Eltern (bei anderen Mitgliedern) */}
                {isParent && m.id !== currentUserId && (
                  <select
                    value={m.family_role}
                    onChange={(e) => handleRoleChange(m.id, e.target.value)}
                    disabled={updatingMember === m.id}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {t(`role_${role}`)}
                      </option>
                    ))}
                  </select>
                )}

                {/* Remove button – nur für Eltern (bei anderen Mitgliedern) */}
                {isParent && m.id !== currentUserId && (
                  <button
                    onClick={() => handleRemove(m.id)}
                    disabled={removingMember === m.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 border border-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {removingMember === m.id ? '…' : t('manage_remove')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Familie löschen – nur für Eltern */}
      {isParent && (
        <div className="glass-card rounded-2xl p-6 border border-red-500/30 space-y-4">
          <h2 className="text-lg font-semibold text-red-500">{t('manage_delete')}</h2>
          <p className="text-sm text-muted-fg">{t('manage_delete_hint')}</p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
            >
              {t('manage_delete')}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-foreground font-medium">
                {t('manage_delete_confirm')}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDisband}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? '…' : t('manage_delete')}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-background/80 transition-colors disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
