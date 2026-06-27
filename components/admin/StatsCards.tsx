"use client"

import type { DashboardOverview } from '@/lib/admin-types'

interface Props {
  overview: DashboardOverview
}

function formatCurrency(value: number): string {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}

export function StatsCards({ overview }: Props) {
  const cards = [
    {
      label: 'Gesamtbuchungen',
      value: overview.total_bookings.toString(),
      sub: `${overview.total_participants} Pilger`,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-transparent',
    },
    {
      label: 'Gesamtumsatz',
      value: formatCurrency(overview.total_revenue),
      sub: `${overview.confirmed_payments} bestätigte Zahlungen`,
      color: 'text-blue-400',
      bg: 'from-blue-500/10 to-transparent',
    },
    {
      label: 'Hajj vs Umrah',
      value: `${overview.hajj_bookings} / ${overview.umrah_bookings}`,
      sub: `${formatCurrency(overview.hajj_revenue)} / ${formatCurrency(overview.umrah_revenue)}`,
      color: 'text-purple-400',
      bg: 'from-purple-500/10 to-transparent',
    },
    {
      label: 'Verfügbare Plätze',
      value: overview.total_seats_available.toString(),
      sub: `${overview.total_packages} aktive Pakete`,
      color: 'text-amber-400',
      bg: 'from-amber-500/10 to-transparent',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`pro-card p-5 rounded-xl bg-gradient-to-br ${card.bg}`}
        >
          <p className="text-xs text-slate-400 mb-2">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}