import { render, screen } from '@testing-library/react'
import CvTimeline from '@/components/portfolio/CvTimeline'
import { CvEntry } from '@/lib/types'

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}))

const mockEntries: CvEntry[] = [
  {
    id: 'cv-1',
    type: 'experience',
    title_de: 'Senior Entwickler',
    title_fr: 'Développeur Senior',
    title_en: 'Senior Developer',
    organization: 'Musterfirma AG',
    start_year: 2022,
    end_year: null,
    description_de: 'Full-Stack Entwicklung.',
    description_fr: 'Développement Full-Stack.',
    description_en: 'Full-Stack development.',
    sort_order: 1,
  },
  {
    id: 'cv-2',
    type: 'education',
    title_de: 'Bachelor Informatik',
    title_fr: 'Licence Informatique',
    title_en: 'Bachelor CS',
    organization: 'Universität Zürich',
    start_year: 2016,
    end_year: 2020,
    description_de: null,
    description_fr: null,
    description_en: null,
    sort_order: 1,
  },
]

describe('CvTimeline', () => {
  it('renders localized experience title in German', () => {
    render(<CvTimeline entries={mockEntries} locale="de" />)
    expect(screen.getByText('Senior Entwickler')).toBeInTheDocument()
  })

  it('renders localized education title in French', () => {
    render(<CvTimeline entries={mockEntries} locale="fr" />)
    expect(screen.getByText('Licence Informatique')).toBeInTheDocument()
  })

  it('renders localized education title in English', () => {
    render(<CvTimeline entries={mockEntries} locale="en" />)
    expect(screen.getByText('Bachelor CS')).toBeInTheDocument()
  })

  it('renders organization names', () => {
    render(<CvTimeline entries={mockEntries} locale="de" />)
    expect(screen.getByText('Musterfirma AG')).toBeInTheDocument()
    expect(screen.getByText('Universität Zürich')).toBeInTheDocument()
  })

  it('shows cv_present key for open-ended entries', () => {
    render(<CvTimeline entries={mockEntries} locale="de" />)
    expect(screen.getByText('2022 – portfolio.cv_present')).toBeInTheDocument()
  })

  it('shows end year for completed entries', () => {
    render(<CvTimeline entries={mockEntries} locale="de" />)
    expect(screen.getByText('2016 – 2020')).toBeInTheDocument()
  })

  it('renders section headings', () => {
    render(<CvTimeline entries={mockEntries} locale="de" />)
    expect(screen.getByText('portfolio.cv_experience')).toBeInTheDocument()
    expect(screen.getByText('portfolio.cv_education')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<CvTimeline entries={mockEntries} locale="de" />)
    expect(screen.getByText('Full-Stack Entwicklung.')).toBeInTheDocument()
  })

  it('does not crash when description is null', () => {
    render(<CvTimeline entries={mockEntries} locale="de" />)
    expect(screen.getByText('Universität Zürich')).toBeInTheDocument()
  })
})
