/**
 * S-21 Admin Dashboard Types
 * TypeScript definitions for Hajj & Umrah analytics
 */

export interface BookingStats {
  status: string
  count: number
  total_revenue: number
  total_participants: number
}

export interface PackageDistribution {
  id: string
  name: string
  type: 'hajj' | 'umrah'
  price_eur: number
  seats_total: number
  seats_booked: number
  booking_count: number
  revenue: number
}

export interface MonthlyTrend {
  month: string
  bookings: number
  revenue: number
  participants: number
}

export interface RecentTransaction {
  id: string
  booking_ref: string
  package_name: string
  package_type: 'hajj' | 'umrah'
  amount: number
  method: string
  payment_status: 'pending' | 'confirmed' | 'failed'
  booking_status: 'draft' | 'confirmed' | 'paid' | 'cancelled'
  sepa_reference: string | null
  created_at: string
  user_email: string | null
}

export interface DashboardOverview {
  total_bookings: number
  total_revenue: number
  total_participants: number
  confirmed_bookings: number
  paid_bookings: number
  cancelled_bookings: number
  pending_payments: number
  confirmed_payments: number
  failed_payments: number
  total_packages: number
  hajj_bookings: number
  umrah_bookings: number
  hajj_revenue: number
  umrah_revenue: number
  total_seats_available: number
}

export type DashboardData = {
  overview: DashboardOverview
  bookingStats: BookingStats[]
  packageDistribution: PackageDistribution[]
  monthlyTrends: MonthlyTrend[]
  recentTransactions: RecentTransaction[]
}