import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Pfade, die Authentifizierung erfordern
const PROTECTED_PATHS = /^\/(de|en|fr|ar)\/alltag\//

export default async function middleware(request: NextRequest) {
  // Step 1: let next-intl handle locale first (returns redirect or rewrite)
  const intlResponse = intlMiddleware(request)

  // Step 2: Create Supabase client that reads from request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            intlResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Step 3: Refresh auth session — reads + potentially writes refreshed cookie
  const { data: { user } } = await supabase.auth.getUser()

  // Step 4: Protect /alltag/* routes — redirect unauthenticated users
  const { pathname } = request.nextUrl
  if (PROTECTED_PATHS.test(pathname) && !user) {
    const locale = pathname.split('/')[1]
    const loginUrl = new URL('/' + locale + '/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\..*).*)'],
}
