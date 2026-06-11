export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-dvh" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}