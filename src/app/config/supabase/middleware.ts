import { createServerClient } from '@supabase/ssr'
import { AuthError } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createServer } from './supabaseServer'

async function handleAuthError(error: AuthError, request: NextRequest) {
  if (error.message === 'Invalid Refresh Token: Refresh Token Not Found') {
    // Sign out the user
    const supabase = await createServer()
    await supabase.auth.signOut()

    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return null // No action needed for other errors
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
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
    error,
  } = await supabase.auth.getUser()

  // Handle authentication errors
  if (error) {
    const redirectResponse = await handleAuthError(error, request)
    if (redirectResponse) {
      return redirectResponse // Return the redirect response if an error was handled
    }
  }

  const url = new URL(request.url)

  if (user) {
    if (url.pathname === '/login' || url.pathname === '/signup') {
      const isAdmin = [
        '1d467d81-c908-4ab2-8c0d-ee9a4630ae65',
        '62a5a2a6-ce55-4ce7-b7e2-b9e13809baf3',
      ].includes(user.id)
      return NextResponse.redirect(
        new URL(isAdmin ? '/admin' : `/dashboard/${user.id}`, request.url)
      )
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
