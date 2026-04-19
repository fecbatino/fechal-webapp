export type TajweedRule = 'qalqalah' | 'madd' | 'ghunna' | 'idgham' | 'normal'

export interface TajweedChar {
  char: string
  rule: TajweedRule
}

const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د'])
const SUKUN = '\u0652'
const SHADDA = '\u0651'
const MADD_MARKER = '\u0653'
const GHUNNA_LETTERS = new Set(['ن', 'م'])

export function applyTajweed(text: string): TajweedChar[] {
  const chars = Array.from(text.normalize('NFD'))
  return chars.map((char, i) => {
    const next = chars[i + 1]

    if (QALQALAH_LETTERS.has(char) && next === SUKUN) {
      return { char, rule: 'qalqalah' }
    }
    if (char === MADD_MARKER) {
      return { char, rule: 'madd' }
    }
    if (GHUNNA_LETTERS.has(char) && next === SHADDA) {
      return { char, rule: 'ghunna' }
    }
    return { char, rule: 'normal' }
  })
}

export const TAJWEED_COLORS: Record<TajweedRule, string> = {
  qalqalah: '#DD0008',
  madd: '#537FFF',
  ghunna: '#168B24',
  idgham: '#26BEC9',
  normal: 'inherit',
}
