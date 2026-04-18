import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Fechal Batakpalé',
  description: 'Portfolio · Alltag · Hajj & Umrah · Vereine',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'de' | 'fr' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
