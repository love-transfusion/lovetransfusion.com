/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_pageToken } from '@/app/utilities/facebook/new/util_fb_pageToken'
import { util_fb_comments } from '@/app/utilities/facebook/new/util_fb_comments'
import pLimit from 'p-limit'

// ✅ ADDED: avatar util
import { util_fb_profile_picture } from '@/app/utilities/facebook/new/util_fb_profile_picture'

type Admin = Awaited<ReturnType<typeof createAdmin>>

export const runtime = 'nodejs'

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${process.env.CRON_SECRET}`) return true
  return false
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
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

// ✅ ADDED: fallback fetch for authors by comment IDs (when c.from is missing)
async function fetchCommentAuthorsByIds(
  commentIds: string[],
  pageAccessToken: string,
  size = 128
): Promise<
  Record<
    string,
    {
      from_id: string | null
      from_name: string | null
      picture_url: string | null
    }
  >
> {
  const out: Record<
    string,
    {
      from_id: string | null
      from_name: string | null
      picture_url: string | null
    }
  > = {}
  if (!commentIds.length) return out
  const unique = Array.from(new Set(commentIds.filter(Boolean)))
  const chunkSize = 50
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize)
    const url = new URL('https://graph.facebook.com/v20.0/')
    url.searchParams.set('ids', chunk.join(','))
    url.searchParams.set(
      'fields',
      `from{id,name,picture.height(${size}).width(${size}){url,is_silhouette}}`
    )
    url.searchParams.set('access_token', pageAccessToken)
    const res = await fetch(url.toString())
    if (!res.ok) {
      console.error('CRON reconcile: author batch fetch failed', {
        status: res.status,
        text: await res.text(),
      })
      continue
    }
    const data = (await res.json()) as Record<
      string,
      {
        from?: {
          id?: string
          name?: string
          picture?: { data?: { url?: string } }
        }
      }
    >
    for (const id of chunk) {
      const f = data?.[id]?.from
      out[id] = {
        from_id: f?.id ?? null,
        from_name: f?.name ?? null,
        picture_url: f?.picture?.data?.url ?? null,
      }
    }
  }
  return out
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
      // ✅ 1) Avatar enrichment for comments that DO have from.id
      let avatarMap: Record<
        string,
        { url: string | null; isSilhouette: boolean | null }
      > = {}
      try {
        const fromIds = Array.from(
          new Set(data.map((c) => c.from?.id).filter((x): x is string => !!x))
        )
        if (fromIds.length) {
          avatarMap = await util_fb_profile_picture({
            clIDs: fromIds,
            clAccessToken: pageToken, // Page Access Token
            clImageDimensions: 128, // bump to 256 if you want
          })
        }
      } catch (e: any) {
        console.error('CRON reconcile: avatar enrichment failed', {
          post_id: post.post_id,
          page_id: post.page_id,
          message: e?.message,
        })
      }

      // ✅ 2) Fallback author fetch for comments with MISSING c.from
      let authorFallback: Record<
        string,
        {
          from_id: string | null
          from_name: string | null
          picture_url: string | null
        }
      > = {}
      try {
        const missingFromIds = data.filter((c) => !c.from?.id).map((c) => c.id)
        if (missingFromIds.length) {
          authorFallback = await fetchCommentAuthorsByIds(
            missingFromIds,
            pageToken,
            128
          )
        }
      } catch (e: any) {
        console.error('CRON reconcile: author fallback fetch failed', {
          post_id: post.post_id,
          page_id: post.page_id,
          message: e?.message,
        })
      }

      const rows: I_supa_facebook_comments_insert[] = data.map((c) => {
        // Prefer values directly from util_fb_comments if they exist
        const fromId = c.from?.id ?? authorFallback[c.id]?.from_id ?? null
        const fromName = c.from?.name ?? authorFallback[c.id]?.from_name ?? null

        // Picture priority:
        // 1) picture contained in util_fb_comments (if that util includes it)
        // 2) avatarMap (when fromId exists)
        // 3) authorFallback picture (when c.from was missing)
        const apiPic = (c as any)?.from?.picture?.data?.url ?? null
        const avatarPic = fromId ? avatarMap[fromId]?.url ?? null : null
        const fallbackPic = authorFallback[c.id]?.picture_url ?? null

        return {
          comment_id: c.id,
          post_id: post.post_id,
          parent_id: c.parent?.id ?? null,
          message: c.message ?? null,
          from_id: fromId,
          from_name: fromName,
          from_picture_url: apiPic ?? avatarPic ?? fallbackPic,
          created_time: c.created_time, // already ISO
          like_count: c.like_count ?? null,
          comment_count: c.comment_count ?? null,
          permalink_url: c.permalink_url ?? null,
          is_hidden: false,
          is_deleted: false,
          raw: c as any,
          updated_at: new Date().toISOString(),
        }
      })

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
