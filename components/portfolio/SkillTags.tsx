'use client'
import { useTranslations } from 'next-intl'
import { PortfolioSkill, SkillCategory } from '@/lib/types'

interface Props {
  skills: PortfolioSkill[]
}

const SKILL_CATEGORIES: SkillCategory[] = ['frontend', 'backend', 'ai', 'tools']

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
        return (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t(`skill_category_${cat}`)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
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
