'use client'
import { useTranslations } from 'next-intl'
import { PortfolioSkill, SkillCategory } from '@/lib/types'

interface Props {
  skills: PortfolioSkill[]
}

const SKILL_CATEGORIES: SkillCategory[] = ['frontend', 'backend', 'ai', 'tools']

const categoryAccents: Record<SkillCategory, { border: string; text: string; bg: string }> = {
  frontend: { border: 'border-teal-500/20', text: 'text-teal-300', bg: 'bg-teal-500/10' },
  backend: { border: 'border-blue-500/20', text: 'text-blue-300', bg: 'bg-blue-500/10' },
  ai: { border: 'border-violet-500/20', text: 'text-violet-300', bg: 'bg-violet-500/10' },
  tools: { border: 'border-amber-500/20', text: 'text-amber-300', bg: 'bg-amber-500/10' },
}

export default function SkillTags({ skills }: Props) {
  const t = useTranslations('portfolio')

  const grouped = skills.reduce<Record<SkillCategory, PortfolioSkill[]>>(
    (acc, skill) => {
      acc[skill.category].push(skill)
      return acc
    },
    { frontend: [], backend: [], ai: [], tools: [] }
  )

  return (
    <div className="space-y-6">
      {SKILL_CATEGORIES.map((cat) => {
        const catSkills = grouped[cat]
        if (catSkills.length === 0) return null
        const accent = categoryAccents[cat]
        return (
          <div key={cat}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accent.text}`}>
              {t(`skill_category_${cat}`)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <span
                  key={skill.id}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${accent.bg} ${accent.text} ${accent.border}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}