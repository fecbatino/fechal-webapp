"use client"

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  DashboardOverviewSchema,
  BookingStatsArraySchema,
  PackageDistributionArraySchema,
  MonthlyTrendArraySchema,
  RecentTransactionArraySchema,
  validateRpc,
  type DashboardData,
} from '@/lib/admin-types'

interface UseAdminDashboardResult {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * S-21: Custom hook for admin dashboard analytics.
 * Calls Supabase RPC functions (Security Definer, admin-role checked).
 * Every RPC response is validated at runtime via Zod safeParse (validateRpc);
 * a failed validation raises a typed RpcValidationError that is surfaced
 * through the error state instead of crashing the dashboard.
 */
export function useAdminDashboard(): UseAdminDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = useCallback(() => setRefreshKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false

    async function fetchDashboard() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Check auth session
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('Not authenticated')
        }

        // Parallel RPC calls for all dashboard data
        const [overviewRes, bookingStatsRes, packageDistRes, monthlyTrendsRes, recentTxRes] = await Promise.all([
          supabase.rpc('get_admin_dashboard_overview'),
          supabase.rpc('get_admin_booking_stats'),
          supabase.rpc('get_admin_package_distribution'),
          supabase.rpc('get_admin_monthly_trends'),
          supabase.rpc('get_admin_recent_transactions', { p_limit: 20 }),
        ])

        if (overviewRes.error) throw new Error(overviewRes.error.message)
        if (bookingStatsRes.error) throw new Error(bookingStatsRes.error.message)
        if (packageDistRes.error) throw new Error(packageDistRes.error.message)
        if (monthlyTrendsRes.error) throw new Error(monthlyTrendsRes.error.message)
        if (recentTxRes.error) throw new Error(recentTxRes.error.message)

        if (cancelled) return

        // Runtime validation via safeParse; throws typed RpcValidationError on drift.
        setData({
          overview: validateRpc('get_admin_dashboard_overview', DashboardOverviewSchema, overviewRes.data),
          bookingStats: validateRpc('get_admin_booking_stats', BookingStatsArraySchema, bookingStatsRes.data),
          packageDistribution: validateRpc('get_admin_package_distribution', PackageDistributionArraySchema, packageDistRes.data),
          monthlyTrends: validateRpc('get_admin_monthly_trends', MonthlyTrendArraySchema, monthlyTrendsRes.data),
          recentTransactions: validateRpc('get_admin_recent_transactions', RecentTransactionArraySchema, recentTxRes.data),
        })
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDashboard()

    return () => { cancelled = true }
  }, [refreshKey])

  return { data, loading, error, refetch }
}
