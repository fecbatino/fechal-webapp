import { applyTajweed } from '@/lib/tajweed'

describe('applyTajweed', () => {
  it('marks qalqalah letter before sukun', () => {
    const result = applyTajweed('قْ')
    expect(result[0]).toEqual({ char: 'ق', rule: 'qalqalah' })
  })

  it('marks madd marker character', () => {
    const result = applyTajweed('آ')
    expect(result[1]).toEqual({ char: '\u0653', rule: 'madd' })
  })

  it('marks ghunna: noon before shadda', () => {
    const result = applyTajweed('نّ')
    expect(result[0]).toEqual({ char: 'ن', rule: 'ghunna' })
  })

  it('normal chars get normal rule', () => {
    const result = applyTajweed('ا')
    expect(result[0]).toEqual({ char: 'ا', rule: 'normal' })
  })

  it('returns one TajweedChar per character', () => {
    const text = 'بِسْمِ'
    const result = applyTajweed(text)
    expect(result).toHaveLength(Array.from(text).length)
  })
})
