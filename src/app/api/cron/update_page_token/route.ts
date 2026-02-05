import { supa_update_facebook_pages } from '@/app/_actions/facebook_pages/actions'
import { util_fb_pageToken } from '@/app/utilities/facebook/util_fb_pageToken'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export const GET = async (req: NextRequest) => {
  if (!isAuthorizedCron(req))
    return new NextResponse('Unauthorized', { status: 401 })

  const clCRON = req.headers.get('authorization')

  const { data: page_token, error } = await util_fb_pageToken()

  if (!page_token) {
    console.error('[CRON] Failed to resolve Facebook Page token', error)

    return NextResponse.json(
      {
        ok: false,
        error: error ?? 'Failed to resolve Facebook Page token',
      },
      { status: 500 },
    )
  }

  await supa_update_facebook_pages({
    clCRON,
    clFacebookPageID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
    clFbPageObj: { page_token },
  })

  return NextResponse.json({
    ok: true,
  })
}
