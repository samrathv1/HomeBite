import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/verify') || url.pathname.startsWith('/role-selection')

  // If user is not logged in and trying to access protected routes
  if (!user && (url.pathname.startsWith('/customer') || url.pathname.startsWith('/provider') || url.pathname.startsWith('/admin'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // If logged in, fetch their role from the database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    if (!role && !url.pathname.startsWith('/role-selection')) {
      url.pathname = '/role-selection'
      return NextResponse.redirect(url)
    }

    if (role === 'customer' && (url.pathname.startsWith('/provider') || url.pathname.startsWith('/admin'))) {
      url.pathname = '/customer/home'
      return NextResponse.redirect(url)
    }

    if (role === 'provider' && (url.pathname.startsWith('/customer') || url.pathname.startsWith('/admin'))) {
      url.pathname = '/provider/dashboard'
      return NextResponse.redirect(url)
    }

    if (role === 'admin' && (url.pathname.startsWith('/customer') || url.pathname.startsWith('/provider'))) {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    // If logged in and trying to access auth pages
    if (isAuthRoute && role) {
      if (role === 'customer') url.pathname = '/customer/home'
      else if (role === 'provider') url.pathname = '/provider/dashboard'
      else if (role === 'admin') url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes - protected separately if needed)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
