import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans bg-background text-foreground min-h-dvh`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}