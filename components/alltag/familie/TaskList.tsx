'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FamilyTask } from '@/lib/types'
import TaskItem from './TaskItem'

interface Props {
  tasks: FamilyTask[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onAdd: (title: string, category: 'task' | 'shopping') => void
}

export default function TaskList({ tasks, onToggle, onDelete, onAdd }: Props) {
  const t = useTranslations('familie')
  const [newTitle, setNewTitle] = useState('')
  const [category, setCategory] = useState<'task' | 'shopping'>('task')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    onAdd(newTitle.trim(), category)
    setNewTitle('')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={t('add_task')}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as 'task' | 'shopping')}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
        >
          <option value="task">{t('task_category_task')}</option>
          <option value="shopping">{t('task_category_shopping')}</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 transition-colors">
          +
        </button>
      </form>
      {tasks.length === 0 ? (
        <p className="text-muted-fg text-sm text-center py-8">{t('no_tasks')}</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  )
}
