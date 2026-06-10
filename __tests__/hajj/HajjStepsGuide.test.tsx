import { render, screen } from '@testing-library/react'
import HajjStepsGuide from '@/components/hajj/HajjStepsGuide'
import { HAJJ_STEPS } from '@/lib/hajj-data'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

describe('HajjStepsGuide', () => {
  it('renders all 7 Hajj steps', () => {
    render(<HajjStepsGuide steps={HAJJ_STEPS} locale="de" />)
    expect(screen.getAllByRole('listitem')).toHaveLength(7)
  })

  it('renders German step titles in German locale', () => {
    render(<HajjStepsGuide steps={HAJJ_STEPS} locale="de" />)
    expect(screen.getByText('Ihram anlegen')).toBeInTheDocument()
  })

  it('renders English step titles in English locale', () => {
    render(<HajjStepsGuide steps={HAJJ_STEPS} locale="en" />)
    expect(screen.getByText('Entering Ihram')).toBeInTheDocument()
  })

  it('renders Arabic text for each step', () => {
    render(<HajjStepsGuide steps={HAJJ_STEPS} locale="de" />)
    expect(screen.getByText('الإحرام')).toBeInTheDocument()
  })
})
