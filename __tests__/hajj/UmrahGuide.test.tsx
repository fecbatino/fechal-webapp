import { render, screen } from '@testing-library/react'
import UmrahGuide from '@/components/hajj/UmrahGuide'
import { UMRAH_STEPS } from '@/lib/hajj-data'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'de',
}))

describe('UmrahGuide', () => {
  it('renders all 4 Umrah steps', () => {
    render(<UmrahGuide steps={UMRAH_STEPS} locale="de" />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('renders French step titles in French locale', () => {
    render(<UmrahGuide steps={UMRAH_STEPS} locale="fr" />)
    expect(screen.getByText(/Ihram au Miqat/)).toBeInTheDocument()
  })

  it('renders Arabic text for each step', () => {
    render(<UmrahGuide steps={UMRAH_STEPS} locale="de" />)
    expect(screen.getByText('الطواف')).toBeInTheDocument()
  })
})
