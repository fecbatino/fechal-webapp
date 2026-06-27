"use client"

import type { RecentTransaction } from '@/lib/admin-types'

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/15 text-red-400 border-red-500/30',
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  failed: 'Fehlgeschlagen',
}

const BOOKING_STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
}

const BOOKING_STATUS_LABELS: Record<string, string> = {
  draft: 'Entwurf',
  confirmed: 'Bestätigt',
  paid: 'Bezahlt',
  cancelled: 'Storniert',
}

interface Props {
  data: RecentTransaction[]
}

export function TransactionsTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="pro-card p-6 rounded-xl">
        <h3 className="text-sm font-medium text-slate-400 mb-4">Letzte Transaktionen</h3>
        <div className="h-[100px] flex items-center justify-center text-slate-500 text-sm">
          Keine Transaktionen vorhanden
        </div>
      </div>
    )
  }

  return (
    <div className="pro-card p-6 rounded-xl overflow-hidden">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Letzte Transaktionen</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-700/50">
              <th className="pb-3 pr-4 font-medium">Ref</th>
              <th className="pb-3 pr-4 font-medium">Paket</th>
              <th className="pb-3 pr-4 font-medium">Typ</th>
              <th className="pb-3 pr-4 font-medium text-right">Betrag</th>
              <th className="pb-3 pr-4 font-medium">Zahlung</th>
              <th className="pb-3 pr-4 font-medium">Buchung</th>
              <th className="pb-3 font-medium">Datum</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pr-4 font-mono text-xs text-slate-300">{tx.booking_ref}</td>
                <td className="py-3 pr-4 text-slate-300">{tx.package_name}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${tx.package_type === 'hajj' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'}`}>
                    {tx.package_type === 'hajj' ? 'Hajj' : 'Umrah'}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right text-slate-200 font-medium">
                  {tx.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${PAYMENT_STATUS_STYLES[tx.payment_status] || ''}`}>
                    {PAYMENT_STATUS_LABELS[tx.payment_status] || tx.payment_status}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${BOOKING_STATUS_STYLES[tx.booking_status] || ''}`}>
                    {BOOKING_STATUS_LABELS[tx.booking_status] || tx.booking_status}
                  </span>
                </td>
                <td className="py-3 text-xs text-slate-400">
                  {new Date(tx.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}