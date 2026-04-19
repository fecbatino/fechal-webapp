import { calculateSM2 } from '@/lib/sm2'

describe('calculateSM2', () => {
  it('quality 0: resets repetitions and interval to 1', () => {
    const result = calculateSM2({ easeFactor: 2.5, repetitions: 3, interval: 10, quality: 0 })
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
  })

  it('quality 2: resets (below 3)', () => {
    const result = calculateSM2({ easeFactor: 2.5, repetitions: 2, interval: 6, quality: 2 })
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
  })

  it('quality 3: first repetition → interval 1', () => {
    const result = calculateSM2({ easeFactor: 2.5, repetitions: 0, interval: 1, quality: 3 })
    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
  })

  it('quality 4: second repetition → interval 6', () => {
    const result = calculateSM2({ easeFactor: 2.5, repetitions: 1, interval: 1, quality: 4 })
    expect(result.repetitions).toBe(2)
    expect(result.interval).toBe(6)
  })

  it('quality 5: third repetition → interval = round(prev * EF)', () => {
    const result = calculateSM2({ easeFactor: 2.5, repetitions: 2, interval: 6, quality: 5 })
    expect(result.repetitions).toBe(3)
    expect(result.interval).toBe(Math.round(6 * 2.5))
  })

  it('ease factor floor is 1.3', () => {
    const result = calculateSM2({ easeFactor: 1.3, repetitions: 0, interval: 1, quality: 0 })
    expect(result.easeFactor).toBeCloseTo(1.3)
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3)
  })

  it('nextDue is a Date object', () => {
    const result = calculateSM2({ easeFactor: 2.5, repetitions: 0, interval: 1, quality: 4 })
    expect(result.nextDue).toBeInstanceOf(Date)
  })
})
