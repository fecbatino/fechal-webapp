/**
 * S-21 Admin Dashboard Types + runtime validation.
 *
 * Zod schemas are the single source of truth: TypeScript types are inferred
 * via z.infer, and lib/use-admin-dashboard.ts parses every RPC response
 * against these schemas instead of using unchecked `as` casts.
 *
 * Shapes mirror supabase/migrations/009_admin_dashboard_rpc.sql exactly.
 * Numeric/money columns use z.coerce.number() because PostgREST may serialize
 * Postgres `numeric` as a string; coercion yields a number either way.
 */

import { z } from 'zod'

export const BookingStatsSchema = z.object({
  status: z.string(),
  count: z.coerce.number(),
  total_revenue: z.coerce.number(),
  total_participants: z.coerce.number(),
})

export const PackageDistributionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['hajj', 'umrah']),
  price_eur: z.coerce.number(),
  seats_total: z.coerce.number(),
  seats_booked: z.coerce.number(),
  booking_count: z.coerce.number(),
  revenue: z.coerce.number(),
})

export const MonthlyTrendSchema = z.object({
  month: z.string(),
  bookings: z.coerce.number(),
  revenue: z.coerce.number(),
  participants: z.coerce.number(),
})

export const RecentTransactionSchema = z.object({
  id: z.string(),
  booking_ref: z.string(),
  package_name: z.string(),
  package_type: z.enum(['hajj', 'umrah']),
  amount: z.coerce.number(),
  method: z.string(),
  payment_status: z.enum(['pending', 'confirmed', 'failed']),
  booking_status: z.enum(['draft', 'confirmed', 'paid', 'cancelled']),
  sepa_reference: z.string().nullable(),
  created_at: z.string(),
  user_email: z.string().nullable(),
})

export const DashboardOverviewSchema = z.object({
  total_bookings: z.coerce.number(),
  total_revenue: z.coerce.number(),
  total_participants: z.coerce.number(),
  confirmed_bookings: z.coerce.number(),
  paid_bookings: z.coerce.number(),
  cancelled_bookings: z.coerce.number(),
  pending_payments: z.coerce.number(),
  confirmed_payments: z.coerce.number(),
  failed_payments: z.coerce.number(),
  total_packages: z.coerce.number(),
  hajj_bookings: z.coerce.number(),
  umrah_bookings: z.coerce.number(),
  hajj_revenue: z.coerce.number(),
  umrah_revenue: z.coerce.number(),
  total_seats_available: z.coerce.number(),
})

// Array schemas for the TABLE-returning RPCs
export const BookingStatsArraySchema = z.array(BookingStatsSchema)
export const PackageDistributionArraySchema = z.array(PackageDistributionSchema)
export const MonthlyTrendArraySchema = z.array(MonthlyTrendSchema)
export const RecentTransactionArraySchema = z.array(RecentTransactionSchema)

// Inferred types — consumed by components; names unchanged for compatibility.
export type BookingStats = z.infer<typeof BookingStatsSchema>
export type PackageDistribution = z.infer<typeof PackageDistributionSchema>
export type MonthlyTrend = z.infer<typeof MonthlyTrendSchema>
export type RecentTransaction = z.infer<typeof RecentTransactionSchema>
export type DashboardOverview = z.infer<typeof DashboardOverviewSchema>

export type DashboardData = {
  overview: DashboardOverview
  bookingStats: BookingStats[]
  packageDistribution: PackageDistribution[]
  monthlyTrends: MonthlyTrend[]
  recentTransactions: RecentTransaction[]
}

/**
 * Typed error thrown when an RPC response fails runtime schema validation.
 * Surfaced through the dashboard hook's error state (async effect errors do
 * not reach React error boundaries), giving a controlled failure instead of
 * a crash on unexpected DB drift.
 */
export class RpcValidationError extends Error {
  constructor(
    public readonly rpc: string,
    public readonly issues: string,
  ) {
    super(`RPC ${rpc} returned data that does not match its schema: ${issues}`)
    this.name = 'RpcValidationError'
  }
}

/**
 * safeParse wrapper: returns typed data on success, throws a typed
 * RpcValidationError (with flattened issue paths) on failure.
 */
export function validateRpc<T>(rpc: string, schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`)
      .join('; ')
    throw new RpcValidationError(rpc, issues)
  }
  return result.data
}
