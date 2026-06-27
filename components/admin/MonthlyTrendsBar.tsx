"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { MonthlyTrend } from '@/lib/admin-types'

interface Props {
  data: MonthlyTrend[]
}

export function MonthlyTrendsBar({ data }: Props) {
  const chartData = data.map(item => ({
    month: item.month,
    Buchungen: item.bookings,
    Umsatz: Number(item.revenue),
    Teilnehmer: item.participants,
  }))

  if (chartData.length === 0) {
    return (
      <div className="pro-card p-6 rounded-xl">
        <h3 className="text-sm font-medium text-slate-400 mb-4">Monatliche Trends</h3>
        <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
          Keine Daten verfügbar
        </div>
      </div>
    )
  }

  return (
    <div className="pro-card p-6 rounded-xl">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Monatliche Buchungs- & Umsatztrends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12 }}
            stroke="#1e293b"
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#64748b', fontSize: 12 }}
            stroke="#1e293b"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 12 }}
            stroke="#1e293b"
            tickFormatter={(v: number) => `${v.toLocaleString('de-DE')}€`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#131923',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#fafbfd',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'Umsatz') return [`${value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`, name]
              return [value, name]
            }}
          />
          <Legend
            iconType="circle"
            formatter={(value: string) => <span className="text-xs text-slate-400">{value}</span>}
          />
          <Bar yAxisId="left" dataKey="Buchungen" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="Umsatz" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}