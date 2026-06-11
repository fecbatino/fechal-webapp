'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ChecklistItem, ChecklistCategory, getMultilingualText } from '@/lib/hajj-data'

interface Props {
  items: ChecklistItem[]
  locale?: string
}

const CATEGORY_ORDER: ChecklistCategory[] = ['documents', 'clothing', 'health', 'essentials']
const STORAGE_KEY = 'hajjPackingChecklist'

const categoryAccents: Record<ChecklistCategory, { color: string; bg: string; border: string }> = {
  documents: { color: 'text-accent', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  clothing: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  health: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  essentials: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
}

export default function PackingChecklist({ items, locale: propLocale }: Props) {
  const hookLocale = useLocale()
  const locale = propLocale ?? hookLocale
  const t = useTranslations('hajj')
  const [checked, setChecked] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setChecked(new Set(JSON.parse(stored) as string[]))
    } catch {}
  }, [])

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

  const grouped = CATEGORY_ORDER.reduce<Record<ChecklistCategory, ChecklistItem[]>>(
    (acc, cat) => {
      acc[cat] = items.filter((item) => item.category === cat)
      return acc
    },
    { documents: [], clothing: [], health: [], essentials: [] }
  )

  const totalChecked = checked.size
  const totalItems = items.length
  const progress = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-fg">
            {t('items_checked', { count: totalChecked, total: totalItems })}
          </span>
          <span className="text-xs text-accent font-medium">{progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-subtle overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const catItems = grouped[cat]
        if (catItems.length === 0) return null
        const accent = categoryAccents[cat]
        return (
          <div key={cat} className="mb-6 last:mb-0">
            <h2 className={`font-semibold mb-3 text-xs uppercase tracking-wide ${accent.color}`}>
              {t(`checklist_cat_${cat}`)}
            </h2>
            <ul className="space-y-2">
              {catItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => toggle(item.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                      checked.has(item.id)
                        ? `${accent.bg} ${accent.border}`
                        : 'border-border hover:border-teal-500/30'
                    }`}
                    role="checkbox"
                    aria-checked={checked.has(item.id)}
                    aria-label={getMultilingualText(item.label, locale)}
                  >
                    {checked.has(item.id) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <label
                    onClick={() => toggle(item.id)}
                    className={`text-sm cursor-pointer transition-colors ${
                      checked.has(item.id) ? 'line-through text-muted-fg' : 'text-subtle-fg hover:text-foreground'
                    }`}
                  >
                    {getMultilingualText(item.label, locale)}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}