import { render, screen } from '@testing-library/react'
import AyahDisplay from '@/components/alltag/koran/AyahDisplay'
import { Ayah } from '@/lib/types'
import { TajweedChar } from '@/lib/tajweed'

const mockAyah: Ayah = {
  number: 1,
  numberInSurah: 1,
  text: 'بِسْمِ',
}

const mockTajweedChars: TajweedChar[] = [
  { char: 'ب', rule: 'normal' },
  { char: 'ِ', rule: 'normal' },
  { char: 'س', rule: 'normal' },
  { char: 'ْ', rule: 'normal' },
  { char: 'م', rule: 'normal' },
  { char: 'ِ', rule: 'normal' },
]

describe('AyahDisplay', () => {
  it('shows ayah number badge', () => {
    render(<AyahDisplay ayah={mockAyah} translation="Im Namen Allahs" tajweedChars={mockTajweedChars} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders translation text', () => {
    render(<AyahDisplay ayah={mockAyah} translation="Im Namen Allahs" tajweedChars={mockTajweedChars} />)
    expect(screen.getByText('Im Namen Allahs')).toBeInTheDocument()
  })

  it('renders tajweed chars in Arabic region', () => {
    render(
      <AyahDisplay
        ayah={mockAyah}
        translation="Im Namen Allahs"
        tajweedChars={mockTajweedChars}
      />
    )
    const arabicContainer = screen.getByRole('region', { name: /arabic/i })
    expect(arabicContainer).toBeInTheDocument()
    expect(arabicContainer).toHaveTextContent('بِسْمِ')
  })
})
