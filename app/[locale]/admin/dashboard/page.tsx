import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata = {
  title: 'Admin Dashboard · Hajj & Umrah Analytics',
  description: 'Geschützte Analytics-Ansicht für Hajj & Umrah Buchungen',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Auth guard: check session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login?redirect=/admin/dashboard')
  }

  // Role guard: check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/?error=insufficient_permissions')
  }

  return <AdminDashboard />
}