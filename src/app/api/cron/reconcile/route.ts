/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_pageToken } from '@/app/utilities/facebook/new/util_fb_pageToken'
import { util_fb_comments } from '@/app/utilities/facebook/new/util_fb_comments'
import pLimit from 'p-limit'

type Admin = Awaited<ReturnType<typeof createAdmin>>

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get('x-vercel-cron') === '1'

  // allow if it's the Vercel scheduled call
  if (!isVercelCron) {
    // otherwise require our bearer secret for manual runs
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${process.env.FACEBOOK_SYNC_SECRET!}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  const supabase = await createAdmin()

  // 1) Load all tracked posts
  const { data: posts, error: postsErr } = await supabase
    .from('facebook_posts')
    .select('*')
  if (postsErr)
    return NextResponse.json(
      { ok: false, error: postsErr.message },
      { status: 500 }
    )

  const limit = pLimit(5) // tune: 3–10

  const results = await Promise.allSettled(
    (posts ?? []).map((p) => limit(() => reconcilePost(supabase, p)))
  )
  const synced = results.filter(
    (r) => r.status === 'fulfilled' && r.value
  ).length
  return NextResponse.json({ ok: true, total: posts?.length ?? 0, synced })
}

async function reconcilePost(supabase: Admin, post: I_supa_facebook_posts_row) {
  // 2) Get a fresh Page Access Token
  const { data: pageToken, error: tokErr } = await util_fb_pageToken({
    pageId: post.page_id,
  })
  if (!pageToken || tokErr) return false

  // Use since = last_synced_at to avoid re-pulling everything every hour
  const since = post.last_synced_at ?? undefined

  let after: string | undefined

  const NEXT_PUBLIC_IDENTITY_ENABLED =
    (process.env.NEXT_PUBLIC_IDENTITY_ENABLED ?? 'false') === 'true'

  do {
    const { data, paging, error } = await util_fb_comments({
      postId: post.post_id,
      pageAccessToken: pageToken,
      order: 'chronological',
      identityEnabled: NEXT_PUBLIC_IDENTITY_ENABLED, // pre-BAUPA
      ...(since ? { since } : {}),
      ...(after ? { after } : {}),
    })
    if (error) break

    if (data?.length) {
      const rows: I_supa_facebook_comments_insert[] = data.map((c) => ({
        comment_id: c.id,
        post_id: post.post_id,
        parent_id: c.parent?.id ?? null,
        message: c.message ?? null,
        from_id: c.from?.id ?? null,
        from_name: c.from?.name ?? null,
        from_picture_url: (c as any)?.from?.picture?.data?.url ?? null,
        created_time: c.created_time, // already ISO
        like_count: c.like_count ?? null,
        comment_count: c.comment_count ?? null,
        permalink_url: c.permalink_url ?? null,
        is_hidden: false,
        is_deleted: false,
        raw: c as any,
        updated_at: new Date().toISOString(),
      }))

      // Bulk upsert in chunks
      const chunkSize = 500
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize)
        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)
        if (upErr) return false
      }
    }

    after = paging?.cursors?.after
  } while (after)

  // 3) Bump last_synced_at even if no new data (we still tried)
  const { error: updErr } = await supabase
    .from('facebook_posts')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('post_id', post.post_id)
  if (updErr) return false

  return true
}
