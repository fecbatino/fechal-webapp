"use client"

import { useAdminDashboard } from '@/lib/use-admin-dashboard'
import { BookingStatusDonut } from '@/components/admin/BookingStatusDonut'
import { MonthlyTrendsBar } from '@/components/admin/MonthlyTrendsBar'
import { TransactionsTable } from '@/components/admin/TransactionsTable'
import { StatsCards } from '@/components/admin/StatsCards'

export function AdminDashboard() {
  const { data, loading, error, refetch } = useAdminDashboard()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="pro-card p-8 rounded-xl text-center">
          <p className="text-red-400 mb-2">Fehler beim Laden der Daten</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-sm"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Hajj & Umrah Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Live-Dashboard · Buchungen · Zahlungen · Pakete</p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:bg-slate-700/80 transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Aktualisieren
        </button>
      </div>

      {/* KPI Cards */}
      <StatsCards overview={data.overview} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingStatusDonut data={data.bookingStats} />
        <MonthlyTrendsBar data={data.monthlyTrends} />
      </div>

      {/* Transactions Table */}
      <TransactionsTable data={data.recentTransactions} />
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="h-8 w-64 bg-slate-700/30 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="pro-card p-6 rounded-xl">
            <div className="h-4 w-20 bg-slate-700/40 rounded animate-pulse mb-3" />
            <div className="h-8 w-28 bg-slate-700/50 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="pro-card p-6 rounded-xl">
            <div className="h-4 w-32 bg-slate-700/40 rounded animate-pulse mb-4" />
            <div className="h-[200px] bg-slate-700/20 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="pro-card p-6 rounded-xl">
        <div className="h-4 w-40 bg-slate-700/40 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-slate-700/20 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}