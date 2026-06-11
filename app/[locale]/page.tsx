import Hero from '@/components/home/Hero'
import SectionCards from '@/components/home/SectionCards'
import BlogPreview from '@/components/home/BlogPreview'
import TechStack from '@/components/home/TechStack'
import KioskSection from '@/components/home/KioskSection'
import AboutSection from '@/components/home/AboutSection'
import ContactSection from '@/components/home/ContactSection'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  return (
    <>
      <Hero />
      <SectionCards />
      <BlogPreview locale={locale} />
      <TechStack />
      <KioskSection locale={locale} />
      <AboutSection />
      <ContactSection />
    </>
  )
}