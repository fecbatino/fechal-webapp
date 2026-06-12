export interface SM2Input {
  easeFactor: number
  repetitions: number
  interval: number
  quality: number // 0–5
}

export interface SM2Output {
  easeFactor: number
  repetitions: number
  interval: number
  nextDue: Date
}

export function calculateSM2(input: SM2Input): SM2Output {
  const { quality } = input
  let { easeFactor, repetitions, interval } = input

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  const nextDue = new Date()
  nextDue.setDate(nextDue.getDate() + interval)

  return { easeFactor, repetitions, interval, nextDue }
}
