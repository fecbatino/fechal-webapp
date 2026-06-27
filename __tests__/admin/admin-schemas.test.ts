import {
  DashboardOverviewSchema,
  BookingStatsArraySchema,
  RecentTransactionArraySchema,
} from '@/lib/admin-types'

describe('admin Zod schemas', () => {
  it('parses a valid booking-stats row and coerces numeric strings', () => {
    // PostgREST may serialize numeric as a string; coercion must yield numbers.
    const parsed = BookingStatsArraySchema.parse([
      { status: 'confirmed', count: 3, total_revenue: '1499.50', total_participants: 7 },
    ])
    expect(parsed[0].total_revenue).toBe(1499.5)
    expect(typeof parsed[0].count).toBe('number')
  })

  it('parses the full overview object (15 keys)', () => {
    const overview = {
      total_bookings: 10, total_revenue: 5000, total_participants: 25,
      confirmed_bookings: 6, paid_bookings: 4, cancelled_bookings: 0,
      pending_payments: 2, confirmed_payments: 8, failed_payments: 0,
      total_packages: 3, hajj_bookings: 5, umrah_bookings: 5,
      hajj_revenue: 3000, umrah_revenue: 2000, total_seats_available: 40,
    }
    expect(() => DashboardOverviewSchema.parse(overview)).not.toThrow()
  })

  it('rejects an unknown package_type enum value', () => {
    const bad = [{
      id: 'p1', booking_ref: 'B-1', package_name: 'X', package_type: 'flight',
      amount: 100, method: 'sepa', payment_status: 'pending', booking_status: 'draft',
      sepa_reference: null, created_at: '2026-06-27T00:00:00Z', user_email: null,
    }]
    expect(() => RecentTransactionArraySchema.parse(bad)).toThrow()
  })

  it('rejects a missing required overview key', () => {
    expect(() => DashboardOverviewSchema.parse({ total_bookings: 1 })).toThrow()
  })
})
