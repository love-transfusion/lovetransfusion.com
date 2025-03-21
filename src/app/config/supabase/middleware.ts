import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const url = new URL(request.url)

  if (user) {
    if (url.pathname === '/login' || url.pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } else if (
    (!user && url.pathname === '/login') ||
    (!user && url.pathname === '/signup')
  ) {
    // Do Nothing
  } else {
    return NextResponse.redirect(
      new URL(`/login?next=${url.pathname.slice(1)}`, request.url)
    )
  }
}
