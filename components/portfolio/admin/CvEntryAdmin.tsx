'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { CvEntry, CvEntryType } from '@/lib/types'

interface Props {
  initialEntries: CvEntry[]
}

type UpsertPayload = Omit<CvEntry, 'id'> & { id?: string }

type FormData = {
  id?: string
  type: CvEntryType
  title_de: string
  title_fr: string
  title_en: string
  organization: string
  start_year: number
  end_year: string
  description_de: string
  description_fr: string
  description_en: string
  sort_order: number
}

const emptyForm = (): FormData => ({
  type: 'experience',
  title_de: '',
  title_fr: '',
  title_en: '',
  organization: '',
  start_year: new Date().getFullYear(),
  end_year: '',
  description_de: '',
  description_fr: '',
  description_en: '',
  sort_order: 0,
})

function entryToForm(e: CvEntry): FormData {
  return {
    id: e.id,
    type: e.type,
    title_de: e.title_de,
    title_fr: e.title_fr,
    title_en: e.title_en,
    organization: e.organization,
    start_year: e.start_year,
    end_year: e.end_year !== null ? String(e.end_year) : '',
    description_de: e.description_de ?? '',
    description_fr: e.description_fr ?? '',
    description_en: e.description_en ?? '',
    sort_order: e.sort_order,
  }
}

export default function CvEntryAdmin({ initialEntries }: Props) {
  const t = useTranslations('portfolio')
  const [entries, setEntries] = useState<CvEntry[]>(initialEntries)
  const [form, setForm] = useState<FormData | null>(null)

  function openNew() { setForm(emptyForm()) }
  function openEdit(entry: CvEntry) { setForm(entryToForm(entry)) }
  function closeForm() { setForm(null) }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    if (!form) return
    const { name, value } = e.target
    const numericFields = ['start_year', 'sort_order']
    setForm({ ...form, [name]: numericFields.includes(name) ? Number(value) : value })
  }

  async function handleSave() {
    if (!form) return
    const supabase = createClient()
    const payload: UpsertPayload = {
      ...(form.id ? { id: form.id } : {}),
      type: form.type,
      title_de: form.title_de,
      title_fr: form.title_fr,
      title_en: form.title_en,
      organization: form.organization,
      start_year: form.start_year,
      end_year: form.end_year.trim() ? Number(form.end_year) : null,
      description_de: form.description_de.trim() || null,
      description_fr: form.description_fr.trim() || null,
      description_en: form.description_en.trim() || null,
      sort_order: form.sort_order,
    }
    const { data: saved, error } = await supabase
      .from('cv_entries')
      .upsert(payload)
      .select()
      .single()
    if (error) {
      console.error('upsert error:', error.message)
      return
    }
    if (form.id) {
      setEntries((prev) => prev.map((e) => (e.id === form.id ? (saved as CvEntry) : e)))
    } else {
      setEntries((prev) => [...prev, saved as CvEntry])
    }
    setForm(null)
  }

  async function handleDelete(entry: CvEntry) {
    const supabase = createClient()
    const { error } = await supabase.from('cv_entries').delete().eq('id', entry.id)
    if (error) {
      console.error('delete error:', error.message)
      return
    }
    setEntries((prev) => prev.filter((e) => e.id !== entry.id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('admin_cv')}</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="experience">experience</option>
                <option value="education">education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_title_de')}</label>
              <input aria-label={t('admin_field_title_de')} name="title_de" value={form.title_de} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_title_fr')}</label>
              <input aria-label={t('admin_field_title_fr')} name="title_fr" value={form.title_fr} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_title_en')}</label>
              <input aria-label={t('admin_field_title_en')} name="title_en" value={form.title_en} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_organization')}</label>
              <input aria-label={t('admin_field_organization')} name="organization" value={form.organization} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_start_year')}</label>
              <input aria-label={t('admin_field_start_year')} name="start_year" type="number" value={form.start_year} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_end_year')}</label>
              <input aria-label={t('admin_field_end_year')} name="end_year" type="number" value={form.end_year} onChange={handleChange} placeholder="" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_desc_de')}</label>
              <textarea aria-label={t('admin_field_desc_de')} name="description_de" value={form.description_de} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_desc_fr')}</label>
              <textarea aria-label={t('admin_field_desc_fr')} name="description_fr" value={form.description_fr} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_desc_en')}</label>
              <textarea aria-label={t('admin_field_desc_en')} name="description_en" value={form.description_en} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin_field_sort_order')}</label>
              <input aria-label={t('admin_field_sort_order')} name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
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
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
            <span className="text-sm font-medium">{entry.title_de}</span>
            <div className="flex gap-2">
              <button onClick={() => openEdit(entry)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">
                {t('admin_edit')}
              </button>
              <button onClick={() => handleDelete(entry)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                {t('admin_delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
