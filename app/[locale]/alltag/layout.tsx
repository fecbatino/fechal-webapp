import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AlltagLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}/auth/login`)
  }

  return <>{children}</>
}
