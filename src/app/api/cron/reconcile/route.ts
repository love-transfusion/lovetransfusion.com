/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_pageToken } from '@/app/utilities/facebook/new/util_fb_pageToken'
import { util_fb_comments } from '@/app/utilities/facebook/new/util_fb_comments'
import pLimit from 'p-limit'

// Avatar util (kept from your version)
import { util_fb_profile_picture } from '@/app/utilities/facebook/new/util_fb_profile_picture'

type Admin = Awaited<ReturnType<typeof createAdmin>>

export const runtime = 'nodejs'
// ↑ Pro plan: allow long-running cron invocations
export const maxDuration = 300

// ---- Tunables via env (all optional) ----
const BATCH_SIZE = 10 // posts per run
const CONCURRENCY = 5 // parallel posts
const PER_POST_BUDGET_MS = 20000 // ~20s/post

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createAdmin()

  // 1) Pick a small, fair batch: oldest/unsynced/nulls first.
  //    Prefer posts that are idle/deferred/error. (Running is skipped.)
  const { data: posts, error: postsErr } = await supabase
    .from('facebook_posts')
    .select('*')
    .in('sync_status', ['idle', 'deferred', 'error'] as any)
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  if (postsErr) {
    return NextResponse.json(
      { ok: false, error: postsErr.message },
      { status: 500 }
    )
  }

  const limit = pLimit(CONCURRENCY)

  // 2) Mark selected posts as running (best-effort; prevents overlap if you ever scale out)
  if (posts?.length) {
    const ids = posts.map((p) => p.post_id)
    await supabase
      .from('facebook_posts')
      .update({ sync_status: 'running', last_error: null })
      .in('post_id', ids)
  }

  // 3) Process each selected post with a per-post time budget
  const results = await Promise.allSettled(
    (posts ?? []).map((p) =>
      limit(() => reconcilePost(supabase, p as I_supa_facebook_posts_row))
    )
  )

  // Count successes
  const synced = results.filter(
    (r) => r.status === 'fulfilled' && r.value === true
  ).length

  return NextResponse.json({ ok: true, picked: posts?.length ?? 0, synced })
}

// ---------- helpers ----------

// Fallback author fetch by comment IDs (when c.from is missing)
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
  const startedAt = Date.now()
  const deadline = startedAt + PER_POST_BUDGET_MS

  // 0) Resolve page token
  const { data: pageToken, error: tokErr } = await util_fb_pageToken({
    pageId: post.page_id,
  })
  if (!pageToken || tokErr) {
    await markPostError(
      supabase,
      post.post_id,
      `page token retrieval failed: ${tokErr?.message ?? 'no token'}`
    )
    return false
  }

  // 1) Use resume cursor if present; else use since=last_synced_at to avoid full re-pulls
  const since = post.last_synced_at ?? undefined
  let after: string | undefined = post.next_cursor ?? undefined
  let finished = false

  const NEXT_PUBLIC_IDENTITY_ENABLED =
    (process.env.NEXT_PUBLIC_IDENTITY_ENABLED ?? 'false') === 'true'

  do {
    // time budget guard
    if (Date.now() > deadline) {
      await deferPost(supabase, post.post_id, after)
      return false // not finished; will resume next run
    }

    const { data, paging, error } = await util_fb_comments({
      postId: post.post_id,
      pageAccessToken: pageToken,
      order: 'chronological',
      identityEnabled: NEXT_PUBLIC_IDENTITY_ENABLED,
      ...(since ? { since } : {}),
      ...(after ? { after } : {}),
    })

    if (error) {
      await markPostError(supabase, post.post_id, `util_fb_comments error`)
      return false
    }

    // Enrich & upsert this page of comments
    if (data?.length) {
      // 1) Avatars for comments that already have from.id
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
            clAccessToken: pageToken,
            clImageDimensions: 128, // bump to 256 if you prefer
          })
        }
      } catch (e: any) {
        console.error('CRON reconcile: avatar enrichment failed', {
          post_id: post.post_id,
          page_id: post.page_id,
          message: e?.message,
        })
      }

      // 2) Fallback author fetch for comments missing c.from **id OR name**
      let authorFallback: Record<
        string,
        {
          from_id: string | null
          from_name: string | null
          picture_url: string | null
        }
      > = {}
      try {
        const needsAuthor = data
          .filter((c) => !(c.from?.id && c.from?.name)) // ← either field missing
          .map((c) => c.id)

        if (needsAuthor.length) {
          authorFallback = await fetchCommentAuthorsByIds(
            needsAuthor,
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
        const fromId = c.from?.id ?? authorFallback[c.id]?.from_id ?? null
        const fromName = c.from?.name ?? authorFallback[c.id]?.from_name ?? null

        const apiPic = (c as any)?.from?.picture?.data?.url ?? null
        const avatarPic = fromId ? avatarMap[fromId]?.url ?? null : null
        const fallbackPic = authorFallback[c.id]?.picture_url ?? null

        const rawCreated = c.created_time as any
        const createdISO =
          typeof rawCreated === 'number'
            ? new Date(rawCreated * 1000).toISOString()
            : new Date(rawCreated).toISOString()

        return {
          comment_id: c.id,
          post_id: post.post_id,
          parent_id: c.parent?.id ?? null,
          message: c.message ?? null,
          from_id: fromId,
          from_name: fromName,
          from_picture_url: apiPic ?? avatarPic ?? fallbackPic,
          created_time: createdISO,
          like_count: c.like_count ?? null,
          comment_count: c.comment_count ?? null,
          permalink_url: c.permalink_url ?? null,
          is_hidden: false,
          is_deleted: false,
          raw: c as any,
          updated_at: new Date().toISOString(),
        }
      })

      // Upsert in chunks
      const chunkSize = 500
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize)
        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)

        if (upErr) {
          await markPostError(
            supabase,
            post.post_id,
            `comments upsert error: ${upErr.message}`
          )
          return false
        }
      }
    }

    // 3) Update resume cursor after each page (so we never redo work)
    after = paging?.cursors?.after
    await supabase
      .from('facebook_posts')
      .update({ next_cursor: after ?? null }) // null when finished
      .eq('post_id', post.post_id)

    // loop until no 'after'
    finished = !after
  } while (!finished)

  // 4) Finished this post: clear cursor, set idle, reset retry counter, bump last_synced_at
  const { error: updErr } = await supabase
    .from('facebook_posts')
    .update({
      next_cursor: null,
      sync_status: 'idle',
      retry_count: 0,
      last_error: null,
      last_synced_at: new Date().toISOString(),
    })
    .eq('post_id', post.post_id)

  if (updErr) {
    await markPostError(
      supabase,
      post.post_id,
      `last_synced_at update failed: ${updErr.message}`
    )
    return false
  }

  return true
}

// Mark a post as deferred (time budget hit) and persist the cursor (if any)
async function deferPost(
  supabase: Admin,
  post_id: string,
  next_cursor?: string
) {
  await supabase
    .from('facebook_posts')
    .update({
      sync_status: 'deferred',
      next_cursor: next_cursor ?? null,
      last_error: null,
    })
    .eq('post_id', post_id)
}

// Mark a post as error, increment retry_count and capture last_error
async function markPostError(
  supabase: Admin,
  post_id: string,
  message: string
) {
  await supabase
    .from('facebook_posts')
    .update({
      sync_status: 'error',
      retry_count: (await getCurrentRetry(supabase, post_id)) + 1,
      last_error: message.slice(0, 1000),
    })
    .eq('post_id', post_id)
}

async function getCurrentRetry(
  supabase: Admin,
  post_id: string
): Promise<number> {
  const { data } = await supabase
    .from('facebook_posts')
    .select('retry_count')
    .eq('post_id', post_id)
    .maybeSingle()
  return data?.retry_count ?? 0
}
