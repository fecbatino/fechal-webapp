'use client'
import { useTranslations } from 'next-intl'
import { FamilyRole, Profile } from '@/lib/types'

interface Props {
  members: Pick<Profile, 'id' | 'email' | 'full_name' | 'family_role'>[]
  currentUserId: string
}

const roleEmoji: Record<FamilyRole, string> = {
  parent: '👨‍👩‍👧',
  child: '🧒',
  member: '👤',
}

export default function FamilyMembers({ members, currentUserId }: Props) {
  const t = useTranslations('familie')

  return (
    <ul className="space-y-3">
      {members.map((m) => (
        <li
          key={m.id}
          className={`flex items-center gap-4 p-4 rounded-xl border ${
            m.id === currentUserId ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white'
          }`}
        >
          <span className="text-2xl">{roleEmoji[m.family_role ?? 'member']}</span>
          <div>
            <p className="font-medium text-gray-800">{m.full_name ?? m.email}</p>
            <p className="text-xs text-gray-400">{t(`role_${m.family_role ?? 'member'}`)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
