'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { PortfolioProject, ProjectCategory } from '@/lib/types'

interface Props {
  initialProjects: PortfolioProject[]
}

type UpsertPayload = Omit<PortfolioProject, 'id' | 'created_at'> & { id?: string }

type FormData = {
  id?: string
  category: ProjectCategory
  title_de: string
  title_fr: string
  title_en: string
  description_de: string
  description_fr: string
  description_en: string
  tech_stack: string
  github_url: string
  live_url: string
  screenshot_url: string
  sort_order: number
}

const emptyForm = (): FormData => ({
  category: 'web',
  title_de: '',
  title_fr: '',
  title_en: '',
  description_de: '',
  description_fr: '',
  description_en: '',
  tech_stack: '',
  github_url: '',
  live_url: '',
  screenshot_url: '',
  sort_order: 0,
})

function projectToForm(p: PortfolioProject): FormData {
  return {
    id: p.id,
    category: p.category,
    title_de: p.title_de,
    title_fr: p.title_fr,
    title_en: p.title_en,
    description_de: p.description_de,
    description_fr: p.description_fr,
    description_en: p.description_en,
    tech_stack: p.tech_stack.join(', '),
    github_url: p.github_url ?? '',
    live_url: p.live_url ?? '',
    screenshot_url: p.screenshot_url ?? '',
    sort_order: p.sort_order,
  }
}

export default function ProjectAdmin({ initialProjects }: Props) {
  const t = useTranslations('portfolio')
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects)
  const [form, setForm] = useState<FormData | null>(null)

  function openNew() {
    setForm(emptyForm())
  }

  function openEdit(project: PortfolioProject) {
    setForm(projectToForm(project))
  }

  function closeForm() {
    setForm(null)
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    if (!form) return
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'sort_order' ? Number(value) : value })
  }

  async function handleSave() {
    if (!form) return
    const supabase = createClient()
    const payload: UpsertPayload = {
      ...(form.id ? { id: form.id } : {}),
      category: form.category,
      title_de: form.title_de,
      title_fr: form.title_fr,
      title_en: form.title_en,
      description_de: form.description_de,
      description_fr: form.description_fr,
      description_en: form.description_en,
      tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      github_url: form.github_url.trim() || null,
      live_url: form.live_url.trim() || null,
      screenshot_url: form.screenshot_url.trim() || null,
      sort_order: form.sort_order,
    }
    const { data: saved, error } = await supabase
      .from('portfolio_projects')
      .upsert(payload)
      .select()
      .single()
    if (error) {
      console.error('upsert error:', error.message)
      return
    }
    if (form.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === form.id ? (saved as PortfolioProject) : p))
      )
    } else {
      setProjects((prev) => [...prev, saved as PortfolioProject])
    }
    setForm(null)
  }

  async function handleDelete(project: PortfolioProject) {
    const supabase = createClient()
    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', project.id)
    if (error) {
      console.error('delete error:', error.message)
      return
    }
    setProjects((prev) => prev.filter((p) => p.id !== project.id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('admin_projects')}</h3>
        {!form && (
          <button
            onClick={openNew}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {t('admin_new')}
          </button>
        )}
      </div>

      {form && (
        <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_title_de')}
              </label>
              <input
                aria-label={t('admin_field_title_de')}
                name="title_de"
                value={form.title_de}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_title_fr')}
              </label>
              <input
                aria-label={t('admin_field_title_fr')}
                name="title_fr"
                value={form.title_fr}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_title_en')}
              </label>
              <input
                aria-label={t('admin_field_title_en')}
                name="title_en"
                value={form.title_en}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_desc_de')}
              </label>
              <textarea
                aria-label={t('admin_field_desc_de')}
                name="description_de"
                value={form.description_de}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_desc_fr')}
              </label>
              <textarea
                aria-label={t('admin_field_desc_fr')}
                name="description_fr"
                value={form.description_fr}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_desc_en')}
              </label>
              <textarea
                aria-label={t('admin_field_desc_en')}
                name="description_en"
                value={form.description_en}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="web">web</option>
                <option value="ai">ai</option>
                <option value="vereine">vereine</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_tech_stack')}
              </label>
              <input
                aria-label={t('admin_field_tech_stack')}
                name="tech_stack"
                value={form.tech_stack}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_github_url')}
              </label>
              <input
                aria-label={t('admin_field_github_url')}
                name="github_url"
                value={form.github_url}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_live_url')}
              </label>
              <input
                aria-label={t('admin_field_live_url')}
                name="live_url"
                value={form.live_url}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_screenshot_url')}
              </label>
              <input
                aria-label={t('admin_field_screenshot_url')}
                name="screenshot_url"
                value={form.screenshot_url}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin_field_sort_order')}
              </label>
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
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              {t('admin_save')}
            </button>
            <button
              onClick={closeForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              {t('admin_cancel')}
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white"
          >
            <span className="text-sm font-medium">{project.title_de}</span>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(project)}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
              >
                {t('admin_edit')}
              </button>
              <button
                onClick={() => handleDelete(project)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                {t('admin_delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
