-- ============================================================================
-- 009_admin_dashboard_rpc.sql
-- S-21 Admin Dashboard — Source-of-Truth for analytics RPC functions.
-- Captures live DB definitions into version control (Loop 2 audit fix).
--
-- Consumed by: lib/use-admin-dashboard.ts -> supabase.rpc(...)
-- Typed by:    lib/admin-types.ts (interfaces MUST mirror RETURNS shapes below)
--
-- All functions are SECURITY DEFINER and self-guard via get_profile_role()
-- (defined in an earlier migration). EXECUTE is granted to anon/authenticated/
-- service_role per PostgREST default; the internal admin-role check is the
-- actual access boundary.
-- ============================================================================

-- BookingStats[]
CREATE OR REPLACE FUNCTION public.get_admin_booking_stats()
  RETURNS TABLE(status text, count integer, total_revenue numeric, total_participants integer)
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $function$
BEGIN
  IF get_profile_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY
  SELECT
    b.status::text,
    COUNT(*)::int,
    COALESCE(SUM(b.total_amount), 0)::numeric(12,2),
    COALESCE(SUM(b.participants), 0)::int
  FROM public.bookings b
  GROUP BY b.status
  ORDER BY b.status;
END;
$function$;

-- DashboardOverview (single json object — 15 keys mirror lib/admin-types.ts)
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_overview()
  RETURNS json
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $function$
DECLARE
  result JSON;
BEGIN
  IF get_profile_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  SELECT json_build_object(
    'total_bookings', (SELECT COUNT(*) FROM bookings),
    'total_revenue', (SELECT COALESCE(SUM(total_amount),0) FROM bookings),
    'total_participants', (SELECT COALESCE(SUM(participants),0) FROM bookings),
    'confirmed_bookings', (SELECT COUNT(*) FROM bookings WHERE status='confirmed'),
    'paid_bookings', (SELECT COUNT(*) FROM bookings WHERE status='paid'),
    'cancelled_bookings', (SELECT COUNT(*) FROM bookings WHERE status='cancelled'),
    'pending_payments', (SELECT COUNT(*) FROM payments WHERE status='pending'),
    'confirmed_payments', (SELECT COUNT(*) FROM payments WHERE status='confirmed'),
    'failed_payments', (SELECT COUNT(*) FROM payments WHERE status='failed'),
    'total_packages', (SELECT COUNT(*) FROM packages WHERE is_active=true),
    'hajj_bookings', (SELECT COUNT(*) FROM bookings b JOIN packages p ON b.package_id=p.id WHERE p.type='hajj'),
    'umrah_bookings', (SELECT COUNT(*) FROM bookings b JOIN packages p ON b.package_id=p.id WHERE p.type='umrah'),
    'hajj_revenue', (SELECT COALESCE(SUM(b.total_amount),0) FROM bookings b JOIN packages p ON b.package_id=p.id WHERE p.type='hajj'),
    'umrah_revenue', (SELECT COALESCE(SUM(b.total_amount),0) FROM bookings b JOIN packages p ON b.package_id=p.id WHERE p.type='umrah'),
    'total_seats_available', (SELECT COALESCE(SUM(seats_total - seats_booked),0) FROM packages WHERE is_active=true)
  ) INTO result;
  RETURN result;
END;
$function$;

-- MonthlyTrend[]
CREATE OR REPLACE FUNCTION public.get_admin_monthly_trends()
  RETURNS TABLE(month text, bookings integer, revenue numeric, participants integer)
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $function$
BEGIN
  IF get_profile_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', b.created_at), 'YYYY-MM')::text,
    COUNT(*)::int,
    COALESCE(SUM(b.total_amount), 0)::numeric(12,2),
    COALESCE(SUM(b.participants), 0)::int
  FROM public.bookings b
  GROUP BY DATE_TRUNC('month', b.created_at)
  ORDER BY month;
END;
$function$;

-- PackageDistribution[]
CREATE OR REPLACE FUNCTION public.get_admin_package_distribution()
  RETURNS TABLE(id uuid, name text, type text, price_eur numeric, seats_total integer, seats_booked integer, booking_count integer, revenue numeric)
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $function$
BEGIN
  IF get_profile_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.name::text,
    p.type::text,
    p.price_eur,
    p.seats_total,
    p.seats_booked,
    COUNT(b.id)::int,
    COALESCE(SUM(b.total_amount), 0)::numeric(12,2)
  FROM public.packages p
  LEFT JOIN public.bookings b ON b.package_id = p.id
  GROUP BY p.id, p.name, p.type, p.price_eur, p.seats_total, p.seats_booked
  ORDER BY booking_count DESC, p.name;
END;
$function$;

-- RecentTransaction[]
CREATE OR REPLACE FUNCTION public.get_admin_recent_transactions(p_limit integer DEFAULT 20)
  RETURNS TABLE(id uuid, booking_ref text, package_name text, package_type text, amount numeric, method text, payment_status text, booking_status text, sepa_reference text, created_at timestamp with time zone, user_email text)
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $function$
BEGIN
  IF get_profile_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY
  SELECT
    pay.id,
    b.booking_ref::text,
    p.name::text,
    p.type::text,
    pay.amount,
    pay.method::text,
    pay.status::text,
    b.status::text,
    pay.sepa_reference::text,
    pay.created_at,
    u.email::text
  FROM public.payments pay
  JOIN public.bookings b ON pay.booking_id = b.id
  LEFT JOIN public.packages p ON b.package_id = p.id
  LEFT JOIN public.users u ON b.user_id = u.id
  ORDER BY pay.created_at DESC
  LIMIT p_limit;
END;
$function$;

-- Grants (PostgREST default; access boundary is the in-body admin check)
GRANT EXECUTE ON FUNCTION public.get_admin_booking_stats()            TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_overview()       TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_admin_monthly_trends()           TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_admin_package_distribution()     TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_admin_recent_transactions(integer) TO anon, authenticated, service_role;
