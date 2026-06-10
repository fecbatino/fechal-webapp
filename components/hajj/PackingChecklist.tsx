'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ChecklistItem, ChecklistCategory, HajjLocale } from '@/lib/hajj-data'

interface Props {
  items: ChecklistItem[]
  locale: string
}

const CATEGORY_ORDER: ChecklistCategory[] = ['documents', 'clothing', 'health', 'essentials']
const STORAGE_KEY = 'hajjPackingChecklist'

function getText(text: { de: string; fr: string; en: string }, locale: string): string {
  return text[locale as HajjLocale] ?? text.de
}

export default function PackingChecklist({ items, locale }: Props) {
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

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-500">
        {t('items_checked', { count: checked.size, total: items.length })}
      </p>

      {CATEGORY_ORDER.map((cat) => {
        const catItems = grouped[cat]
        if (catItems.length === 0) return null
        return (
          <div key={cat}>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
              {t(`checklist_cat_${cat}`)}
            </h3>
            <ul className="space-y-2">
              {catItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={checked.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <label
                    htmlFor={item.id}
                    className={`text-sm cursor-pointer ${checked.has(item.id) ? 'line-through text-gray-400' : 'text-gray-700'}`}
                  >
                    {getText(item.label, locale)}
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
