'use client'
import { FamilyTask } from '@/lib/types'

interface Props {
  task: FamilyTask
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
      />
      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 text-xs px-2"
        aria-label="Löschen"
      >
        ✕
      </button>
    </li>
  )
}
