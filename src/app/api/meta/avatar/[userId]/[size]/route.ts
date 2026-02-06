import { NextRequest, NextResponse } from 'next/server'
import { supa_select_facebook_pages_pageToken } from '@/app/_actions/facebook_pages/actions'

export const runtime = 'nodejs'

// ✅ 12-hour in-memory cache (per warm instance)
let cachedToken: { value: string; expiresAt: number } | null = null

const getPageToken = async () => {
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt > now) return cachedToken.value

  const { data: pageRow, error } = await supa_select_facebook_pages_pageToken({
    clFacebookPageID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
    clCRON: `Bearer ${process.env.CRON_SECRET}`,
  })

  if (error || !pageRow?.page_token) throw new Error('Missing page token')

  // ✅ 12 hours (correct math)
  cachedToken = {
    value: pageRow.page_token.trim(),
    expiresAt: now + 12 * 60 * 60 * 1000,
  }

  return cachedToken.value
}

const redirectFallback = async (req: NextRequest) => {
  const fallbackUrl = new URL(
    '/images/meta-images/user.webp',
    req.nextUrl.origin,
  )

  const res = await fetch(fallbackUrl.toString(), {
    next: { revalidate: 86400 },
  })

  const bytes = await res.arrayBuffer()

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control':
        'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
    },
  })
}

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ userId: string; size: string }> },
) => {
  try {
    const { userId, size } = await props.params

    if (!userId || userId.length < 3) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }
    const accessToken = await getPageToken()
    
    // Ask Graph for a stable image URL (no redirect)
    const graphUrl = new URL(`https://graph.facebook.com/${userId}/picture`)
    graphUrl.searchParams.set('redirect', 'false')
    graphUrl.searchParams.set('type', 'square')
    graphUrl.searchParams.set('height', size)
    graphUrl.searchParams.set('width', size)
    graphUrl.searchParams.set('access_token', accessToken)

    const metaRes = await fetch(graphUrl.toString(), {
      next: { revalidate: 86400 }, // cache this metadata 1 day
    })

    if (!metaRes.ok) return redirectFallback(req)

    const meta = (await metaRes.json()) as {
      data?: { url?: string; is_silhouette?: boolean }
    }

    const fbImageUrl = meta?.data?.url
    const isSilhouette = !!meta?.data?.is_silhouette

    // ✅ If silhouette or missing URL, use fallback without hitting the image CDN
    if (!fbImageUrl || isSilhouette) return redirectFallback(req)

    // Fetch actual image bytes server-side
    const imgRes = await fetch(fbImageUrl, {
      next: { revalidate: 604800 }, // cache 7 days
    })

    if (!imgRes.ok) return redirectFallback(req)

    const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg'
    const bytes = await imgRes.arrayBuffer()

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control':
          'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
      },
    })
  } catch {
    // ✅ On any error, fail soft to fallback avatar (no broken UI)
    return redirectFallback(req)
  }
}
