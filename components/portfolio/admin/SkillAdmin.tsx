'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { PortfolioSkill, SkillCategory } from '@/lib/types'

interface Props {
  initialSkills: PortfolioSkill[]
}

type UpsertPayload = Omit<PortfolioSkill, 'id'> & { id?: string }

type FormData = {
  id?: string
  name: string
  category: SkillCategory
  sort_order: number
}

const emptyForm = (): FormData => ({
  name: '',
  category: 'frontend',
  sort_order: 0,
})

function skillToForm(s: PortfolioSkill): FormData {
  return { id: s.id, name: s.name, category: s.category, sort_order: s.sort_order }
}

export default function SkillAdmin({ initialSkills }: Props) {
  const t = useTranslations('portfolio')
  const [skills, setSkills] = useState<PortfolioSkill[]>(initialSkills)
  const [form, setForm] = useState<FormData | null>(null)

  function openNew() { setForm(emptyForm()) }
  function openEdit(skill: PortfolioSkill) { setForm(skillToForm(skill)) }
  function closeForm() { setForm(null) }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!form) return
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'sort_order' ? Number(value) : value })
  }

  async function handleSave() {
    if (!form) return
    const supabase = createClient()
    const payload: UpsertPayload = {
      ...(form.id ? { id: form.id } : {}),
      name: form.name,
      category: form.category,
      sort_order: form.sort_order,
    }
    const { data: saved, error } = await supabase
      .from('portfolio_skills')
      .upsert(payload)
      .select()
      .single()
    if (error) {
      console.error('upsert error:', error.message)
      return
    }
    if (form.id) {
      setSkills((prev) => prev.map((s) => (s.id === form.id ? (saved as PortfolioSkill) : s)))
    } else {
      setSkills((prev) => [...prev, saved as PortfolioSkill])
    }
    setForm(null)
  }

  async function handleDelete(skill: PortfolioSkill) {
    const supabase = createClient()
    const { error } = await supabase.from('portfolio_skills').delete().eq('id', skill.id)
    if (error) {
      console.error('delete error:', error.message)
      return
    }
    setSkills((prev) => prev.filter((s) => s.id !== skill.id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('admin_skills')}</h3>
        {!form && (
          <button onClick={openNew} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {t('admin_new')}
          </button>
        )}
      </div>

      {form && (
        <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_name')}</label>
              <input
                aria-label={t('admin_field_name')}
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="frontend">frontend</option>
                <option value="backend">backend</option>
                <option value="ai">ai</option>
                <option value="tools">tools</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_sort_order')}</label>
              <input
                aria-label={t('admin_field_sort_order')}
                name="sort_order"
                type="number"
                value={form.sort_order}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              {t('admin_save')}
            </button>
            <button onClick={closeForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
              {t('admin_cancel')}
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
            <span className="text-sm font-medium">{skill.name}</span>
            <div className="flex gap-2">
              <button onClick={() => openEdit(skill)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">
                {t('admin_edit')}
              </button>
              <button onClick={() => handleDelete(skill)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                {t('admin_delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
