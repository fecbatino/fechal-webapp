import { CvEntry } from './types'

export const cvEntries: CvEntry[] = [
  {
    id: 'exp-1',
    type: 'experience',
    title_de: 'Software Entwickler / Engineer',
    title_fr: 'Développeur Logiciel / Ingénieur',
    title_en: 'Software Developer / Engineer',
    title_ar: 'مطور برمجيات / مهندس',
    organization: 'Bayerisches Landesamt für Steuern, Dienststelle Nürnberg (IUK-Bereich)',
    start_year: 2016,
    end_year: null,
    description_de: 'Technischer Amtsrat (TAR) / Technischer Beamter – Entwicklung und Wartung von Enterprise-Anwendungen mit Java Spring Boot, React und Oracle-Datenbanken.',
    description_fr: 'Fonctionnaire Technique (TAR) – Développement et maintenance d\'applications d\'entreprise avec Java Spring Boot, React et bases de données Oracle.',
    description_en: 'Technical Civil Servant (TAR) – Development and maintenance of enterprise applications using Java Spring Boot, React, and Oracle databases.',
    description_ar: 'موظف حكومي تقني (TAR) – تطوير وصيانة تطبيقات المؤسسات باستخدام Java Spring Boot و React و Oracle.',
    sort_order: 1,
  },
  {
    id: 'exp-2',
    type: 'experience',
    title_de: 'Java Entwickler / Engineer',
    title_fr: 'Développeur Java / Ingénieur',
    title_en: 'Java Developer / Engineer',
    title_ar: 'مطور جافا / مهندس',
    organization: 'Elektrobit Automotive / e.solutions GmbH',
    start_year: 2015,
    end_year: 2015,
    description_de: 'Entwicklung von Embedded-Software und Infotainment-Systemen im Automobilbereich mit Java und C++.',
    description_fr: 'Développement de logiciels embarqués et de systèmes d\'infodivertissement dans le domaine automobile avec Java et C++.',
    description_en: 'Development of embedded software and infotainment systems in the automotive sector using Java and C++.',
    description_ar: 'تطوير برمجيات مدمجة وأنظمة ترفيهية في قطاع السيارات باستخدام Java و C++.',
    sort_order: 2,
  },
  {
    id: 'edu-1',
    type: 'education',
    title_de: 'Informatik, Wirtschaftsinformatik & Software Engineering',
    title_fr: 'Informatique, Systèmes d\'Information & Génie Logiciel',
    title_en: 'Computer Science, Business Information Systems & Software Engineering',
    title_ar: 'علوم الحاسوب، نظم المعلومات التجارية وهندسة البرمجيات',
    organization: 'TU Clausthal',
    start_year: 2007,
    end_year: 2014,
    description_de: 'Studium mit Schwerpunkt auf Software Engineering, Datenbanken und IT-Management.',
    description_fr: 'Études axées sur le génie logiciel, les bases de données et la gestion informatique.',
    description_en: 'Studies focused on software engineering, databases, and IT management.',
    description_ar: 'دراسات تركز على هندسة البرمجيات وقواعد البيانات وإدارة تكنولوجيا المعلومات.',
    sort_order: 3,
  },
  {
    id: 'edu-2',
    type: 'education',
    title_de: 'Soziologie (Schwerpunkt: Stadtsoziologie)',
    title_fr: 'Sociologie (Spécialisation: Sociologie Urbaine)',
    title_en: 'Sociology (Focus: Urban Sociology)',
    title_ar: 'علم الاجتماع (تخصص: علم الاجتماع الحضري)',
    organization: 'Universität Lomé',
    start_year: 1998,
    end_year: 2003,
    description_de: 'Grundständiges Studium der Soziologie mit Fokus auf Stadtentwicklung und urbane Gesellschaftsstrukturen.',
    description_fr: 'Études fondamentales en sociologie avec un accent sur le développement urbain et les structures sociales urbaines.',
    description_en: 'Undergraduate studies in sociology with a focus on urban development and urban social structures.',
    description_ar: 'دراسات جامعية في علم الاجتماع مع التركيز على التنمية الحضرية والهياكل الاجتماعية الحضرية.',
    sort_order: 4,
  },
]

export function getLocalizedCvTitle(entry: CvEntry, locale: string): string {
  switch (locale) {
    case 'de': return entry.title_de
    case 'fr': return entry.title_fr
    case 'en': return entry.title_en
    case 'ar': return entry.title_ar
    default: return entry.title_en
  }
}

export function getLocalizedCvDescription(entry: CvEntry, locale: string): string | null {
  switch (locale) {
    case 'de': return entry.description_de
    case 'fr': return entry.description_fr
    case 'en': return entry.description_en
    case 'ar': return entry.description_ar
    default: return entry.description_en
  }
}