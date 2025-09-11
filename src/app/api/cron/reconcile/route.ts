/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_pageToken } from '@/app/utilities/facebook/new/util_fb_pageToken'
import { util_fb_comments } from '@/app/utilities/facebook/new/util_fb_comments'
import pLimit from 'p-limit'

// Avatar util (kept from your version)
import { util_fb_profile_picture } from '@/app/utilities/facebook/new/util_fb_profile_picture'

type Admin = Awaited<ReturnType<typeof createAdmin>>

export const runtime = 'nodejs'
export const maxDuration = 300

const BATCH_SIZE = 10
const CONCURRENCY = 5
const PER_POST_BUDGET_MS = 20000

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  const runId = crypto.randomUUID()
  const span = (s: string) => `[CRON ${runId}] ${s}`

  console.time(span('TOTAL'))
  console.info(span('START'), {
    path: req.nextUrl?.pathname,
    query: Object.fromEntries(new URL(req.url).searchParams.entries()),
    envGraphVer: process.env.NEXT_PUBLIC_GRAPH_VERSION,
    concurrency: CONCURRENCY,
    batchSize: BATCH_SIZE,
    perPostBudgetMs: PER_POST_BUDGET_MS,
  })

  if (!isAuthorizedCron(req)) {
    console.warn(span('AUTH_FAIL'))
    console.timeEnd(span('TOTAL'))
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createAdmin()
  console.info(span('SB_READY'))

  console.time(span('PICK_POSTS'))
  const { data: posts, error: postsErr } = await supabase
    .from('facebook_posts')
    .select('*')
    .in('sync_status', ['idle', 'deferred', 'error'] as any)
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)
  console.timeEnd(span('PICK_POSTS'))

  if (postsErr) {
    console.error(span('PICK_POSTS_ERR'), { message: postsErr.message })
    console.timeEnd(span('TOTAL'))
    return NextResponse.json(
      { ok: false, error: postsErr.message },
      { status: 500 }
    )
  }

  console.info(span('PICK_POSTS_OK'), {
    picked: posts?.length ?? 0,
    postIds: (posts ?? []).map((p) => p.post_id),
  })

  const limit = pLimit(CONCURRENCY)

  if (posts?.length) {
    const ids = posts.map((p) => p.post_id)
    console.time(span('MARK_RUNNING'))
    const { error: updErr } = await supabase
      .from('facebook_posts')
      .update({ sync_status: 'running', last_error: null })
      .in('post_id', ids)
    console.timeEnd(span('MARK_RUNNING'))
    if (updErr) {
      console.error(span('MARK_RUNNING_ERR'), { message: updErr.message })
    } else {
      console.info(span('MARK_RUNNING_OK'), { ids })
    }
  }

  console.time(span('PROCESS_ALL'))
  const results = await Promise.allSettled(
    (posts ?? []).map((p) =>
      limit(() =>
        reconcilePost(supabase, p as I_supa_facebook_posts_row, runId)
      )
    )
  )
  console.timeEnd(span('PROCESS_ALL'))

  const synced = results.filter(
    (r) => r.status === 'fulfilled' && r.value === true
  ).length
  const failed = results.filter(
    (r) => r.status === 'rejected' || r.value === false
  ).length

  console.info(span('DONE'), { synced, failed, picked: posts?.length ?? 0 })
  console.timeEnd(span('TOTAL'))
  return NextResponse.json({
    ok: true,
    runId,
    picked: posts?.length ?? 0,
    synced,
  })
}

// ---------- helpers ----------

async function fetchCommentAuthorsByIds(
  commentIds: string[],
  pageAccessToken: string,
  size = 128,
  runId?: string,
  postId?: string
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
  const span = (s: string) => `[CRON ${runId}] [FALLBACK ${postId}] ${s}`
  const out: Record<
    string,
    {
      from_id: string | null
      from_name: string | null
      picture_url: string | null
    }
  > = {}
  if (!commentIds.length) {
    console.info(span('SKIP_EMPTY'))
    return out
  }

  const GRAPH_VER = process.env.NEXT_PUBLIC_GRAPH_VERSION || 'v20.0'
  const unique = Array.from(new Set(commentIds.filter(Boolean)))
  const chunkSize = 50

  console.info(span('START'), {
    total: unique.length,
    chunkSize,
    graphVer: GRAPH_VER,
  })

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize)

    const batch = chunk.map((id) => ({
      method: 'GET',
      relative_url:
        `${encodeURIComponent(id)}?fields=` +
        encodeURIComponent(
          `from{id,name,picture.height(${size}).width(${size}){url,is_silhouette}}`
        ),
    }))

    console.time(span(`BATCH_${i / chunkSize}_POST`))
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VER}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: pageAccessToken, batch }),
    })
    console.timeEnd(span(`BATCH_${i / chunkSize}_POST`))

    if (!res.ok) {
      const text = await res.text()
      console.warn(span('BATCH_HTTP_FAIL'), { status: res.status, text })
      continue
    }

    const json = (await res.json()) as Array<{ code: number; body: string }>
    let ok = 0
    let err = 0
    json.forEach((item, idx) => {
      if (item.code !== 200) {
        err++
        return
      }
      try {
        const body = JSON.parse(item.body)
        const f = body?.from
        out[chunk[idx]] = {
          from_id: f?.id ?? null,
          from_name: f?.name ?? null,
          picture_url: f?.picture?.data?.url ?? null,
        }
        ok++
      } catch {
        err++
      }
    })
    console.info(span('BATCH_RESULT'), { index: i / chunkSize, ok, err })
  }

  console.info(span('END'), { resolved: Object.keys(out).length })
  return out
}

async function reconcilePost(
  supabase: Admin,
  post: I_supa_facebook_posts_row,
  runId: string
) {
  const postSpan = (s: string) => `[CRON ${runId}] [POST ${post.post_id}] ${s}`
  const startedAt = Date.now()
  const deadline = startedAt + PER_POST_BUDGET_MS
  console.info(postSpan('BEGIN'), {
    page_id: post.page_id,
    since: post.last_synced_at,
    prevCursor: post.next_cursor,
    budgetMs: PER_POST_BUDGET_MS,
  })

  // 0) Resolve page token
  console.time(postSpan('PAGE_TOKEN'))
  const { data: pageToken, error: tokErr } = await util_fb_pageToken({
    pageId: post.page_id,
  })
  console.timeEnd(postSpan('PAGE_TOKEN'))

  if (!pageToken || tokErr) {
    console.error(postSpan('PAGE_TOKEN_ERR'), { error: tokErr })
    await markPostError(
      supabase,
      post.post_id,
      `page token retrieval failed: ${tokErr?.message ?? 'no token'}`
    )
    return false
  } else {
    const masked = pageToken.slice(-6)
    console.info(postSpan('PAGE_TOKEN_OK'), { tokenSuffix: masked })
  }

  const since = post.last_synced_at ?? undefined
  let after: string | undefined = post.next_cursor ?? undefined
  let finished = false

  const NEXT_PUBLIC_IDENTITY_ENABLED =
    (process.env.NEXT_PUBLIC_IDENTITY_ENABLED ?? 'false') === 'true'

  do {
    if (Date.now() > deadline) {
      console.warn(postSpan('BUDGET_EXCEEDED'), { after })
      await deferPost(supabase, post.post_id, after)
      return false
    }

    console.time(postSpan('FETCH_COMMENTS'))
    const { data, paging, error } = await util_fb_comments({
      postId: post.post_id,
      pageAccessToken: pageToken,
      order: 'chronological',
      identityEnabled: NEXT_PUBLIC_IDENTITY_ENABLED,
      ...(since ? { since } : {}),
      ...(after ? { after } : {}),
    })
    console.timeEnd(postSpan('FETCH_COMMENTS'))

    if (error) {
      console.error(postSpan('FETCH_ERR'), { error })
      await markPostError(supabase, post.post_id, `util_fb_comments error`)
      return false
    }

    // ── NEW LOG BLOCK #1: What did Graph actually return?
    if (data && data.length) {
      const withFrom = data.filter((c) => !!c.from)
      const withFromId = data.filter((c) => !!c.from?.id)
      const withFromName = data.filter((c) => !!c.from?.name)
      const withPic = data.filter((c) => !!c.from?.picture?.data?.url)
      const preview = data.slice(0, 5).map((c) => ({
        id: c.id,
        parent: c.parent?.id ?? null,
        from_id: c.from?.id ?? null,
        from_name: c.from?.name ?? null,
        has_pic: !!c.from?.picture?.data?.url,
        msg_len: c.message?.length ?? 0,
        created_time: c.created_time,
      }))
      console.info(postSpan('FETCH_OK_VERBOSE'), {
        count: data.length,
        stats: {
          withFrom: withFrom.length,
          withFromId: withFromId.length,
          withFromName: withFromName.length,
          withPicture: withPic.length,
        },
        preview,
      })
    } else {
      console.info(postSpan('FETCH_OK'), {
        count: data?.length ?? 0,
        after_in: after,
        next_after: paging?.cursors?.after ?? null,
      })
    }
    // ── END NEW LOG BLOCK #1

    if (data?.length) {
      // Avatars for comments that already have from.id
      let avatarMap: Record<
        string,
        { url: string | null; isSilhouette: boolean | null }
      > = {}
      try {
        const fromIds = Array.from(
          new Set(data.map((c) => c.from?.id).filter((x): x is string => !!x))
        )
        console.info(postSpan('AVATAR_IDS'), { uniqueFromIds: fromIds.length })
        if (fromIds.length) {
          console.time(postSpan('AVATAR_ENRICH'))
          avatarMap = await util_fb_profile_picture({
            clIDs: fromIds,
            clAccessToken: pageToken,
            clImageDimensions: 128,
          })
          console.timeEnd(postSpan('AVATAR_ENRICH'))
          console.info(postSpan('AVATAR_DONE'), {
            resolved: Object.keys(avatarMap).length,
          })
        }
      } catch (e: any) {
        console.error(postSpan('AVATAR_FAIL'), { message: e?.message })
      }

      // Fallback author fetch for comments missing id OR name
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
          .filter((c) => !(c.from?.id && c.from?.name))
          .map((c) => c.id)
        console.info(postSpan('FALLBACK_NEED'), { count: needsAuthor.length })
        if (needsAuthor.length) {
          authorFallback = await fetchCommentAuthorsByIds(
            needsAuthor,
            pageToken,
            128,
            runId,
            post.post_id
          )
          // extra insight
          const resolvedNames = Object.values(authorFallback).filter(
            (v) => !!v.from_name
          ).length
          console.info(postSpan('FALLBACK_DONE'), {
            resolved: Object.keys(authorFallback).length,
            resolvedNames,
          })
        }
      } catch (e: any) {
        console.error(postSpan('FALLBACK_ERR'), { message: e?.message })
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

      // ── NEW LOG BLOCK #2: What will we upsert?
      const previewRows = rows.slice(0, 5).map((r) => ({
        comment_id: r.comment_id,
        from_id: r.from_id,
        from_name: r.from_name,
        has_pic: !!r.from_picture_url,
      }))
      const rowsWithName = rows.filter((r) => !!r.from_name).length
      console.info(postSpan('ROWS_PREVIEW'), {
        total: rows.length,
        withFromName: rowsWithName,
        preview: previewRows,
      })
      // ── END NEW LOG BLOCK #2

      // Upsert in chunks
      const chunkSize = 500
      console.time(postSpan('UPSERT'))
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize)
        console.info(postSpan('UPSERT_CHUNK'), {
          index: i / chunkSize,
          size: chunk.length,
        })
        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)

        if (upErr) {
          console.error(postSpan('UPSERT_ERR'), {
            message: upErr.message,
            index: i / chunkSize,
            size: chunk.length,
          })
          await markPostError(
            supabase,
            post.post_id,
            `comments upsert error: ${upErr.message}`
          )
          console.timeEnd(postSpan('UPSERT'))
          return false
        }
      }
      console.timeEnd(postSpan('UPSERT'))
      console.info(postSpan('UPSERT_OK'), { total: rows.length })
    } else {
      console.info(postSpan('NO_DATA_PAGE'))
    }

    after = paging?.cursors?.after
    console.info(postSpan('CURSOR_UPDATE'), { next_after: after ?? null })
    await supabase
      .from('facebook_posts')
      .update({ next_cursor: after ?? null })
      .eq('post_id', post.post_id)

    finished = !after
  } while (!finished)

  console.time(postSpan('FINALIZE'))
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
  console.timeEnd(postSpan('FINALIZE'))

  if (updErr) {
    console.error(postSpan('FINALIZE_ERR'), { message: updErr.message })
    await markPostError(
      supabase,
      post.post_id,
      `last_synced_at update failed: ${updErr.message}`
    )
    return false
  }

  console.info(postSpan('END_OK'))
  return true
}

async function deferPost(
  supabase: Admin,
  post_id: string,
  next_cursor?: string
) {
  console.warn(`[DEFER ${post_id}]`, { next_cursor: next_cursor ?? null })
  await supabase
    .from('facebook_posts')
    .update({
      sync_status: 'deferred',
      next_cursor: next_cursor ?? null,
      last_error: null,
    })
    .eq('post_id', post_id)
}

async function markPostError(
  supabase: Admin,
  post_id: string,
  message: string
) {
  console.error(`[ERROR ${post_id}]`, { message })
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
