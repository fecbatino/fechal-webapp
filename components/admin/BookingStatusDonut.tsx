"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { BookingStats } from '@/lib/admin-types'

const COLORS: Record<string, string> = {
  confirmed: '#10b981',
  paid: '#059669',
  cancelled: '#ef4444',
  draft: '#f59e0b',
}

const LABELS: Record<string, string> = {
  confirmed: 'Bestätigt',
  paid: 'Bezahlt',
  cancelled: 'Storniert',
  draft: 'Entwurf',
}

interface Props {
  data: BookingStats[]
}

interface ChartDatum {
  name: string
  value: number
  status: string
  revenue: number
}

export function BookingStatusDonut({ data }: Props) {
  const chartData: ChartDatum[] = data.map(item => ({
    name: LABELS[item.status] || item.status,
    value: item.count,
    status: item.status,
    revenue: item.total_revenue,
  }))

  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return (
      <div className="pro-card p-6 rounded-xl">
        <h3 className="text-sm font-medium text-slate-400 mb-4">Buchungsstatus</h3>
        <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
          Keine Buchungen vorhanden
        </div>
      </div>
    )
  }

  return (
    <div className="pro-card p-6 rounded-xl">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Buchungsstatus</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#64748b'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#131923',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#fafbfd',
            }}
            formatter={(value: number, _name: string, item: { payload?: ChartDatum }) => {
              const revenue = item?.payload?.revenue ?? 0
              return [
                `${value} Buchungen (${revenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})`,
                'Status',
              ]
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value: string) => <span className="text-xs text-slate-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}