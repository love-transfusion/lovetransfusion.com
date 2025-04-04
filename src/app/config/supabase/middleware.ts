import { restrictedPages } from '@/app/lib/restrictedPages'
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  // try {
  // Create an unmodified response
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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const data = await supabase.auth.getUser()
  const user = data.data.user

  const path = request.nextUrl.pathname

  const doesInclude = restrictedPages.some((item) => path.includes(item))

  // protected routes
  if (user) {
    if (path === '/login' || path === '/signup') {
      const isAdmin = [
        '1d467d81-c908-4ab2-8c0d-ee9a4630ae65',
        '62a5a2a6-ce55-4ce7-b7e2-b9e13809baf3',
      ].includes(user?.id)
      return NextResponse.redirect(
        new URL(isAdmin ? '/admin' : `/dashboard/${user.id}`, request.url)
      )
    }
  } else if (path === '/login' || path === '/signup') {
    return response
  } else if (doesInclude) {
    return NextResponse.redirect(
      new URL(`/login?next=${path.slice(1)}`, request.url)
    )
  }

  return response
  // } catch (e) {
  //   // If you are here, a Supabase client could not be created!
  //   // This is likely because you have not set up environment variables.
  //   // Check out http://localhost:3000 for Next Steps.
  //   return NextResponse.next({
  //     request: {
  //       headers: request.headers,
  //     },
  //   })
  // }
}
