/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import crypto from 'crypto'
import pLimit from 'p-limit'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_pageToken } from '@/app/utilities/facebook/util_fb_pageToken'
import { util_fb_comments } from '@/app/utilities/facebook/util_fb_comments'
import { util_fb_profile_picture } from '@/app/utilities/facebook/util_fb_profile_picture'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300

// ---------------- constants (same as your route) ----------------
const BATCH_SIZE = 10
const CONCURRENCY = 5
const PER_POST_BUDGET_MS = 20000
const NON_EXISTENT_MARKER = 'tombstoned: non-existent/off-surface'

// ---------------- small helpers ----------------
const trim = (v: unknown, max = 500) => {
  try {
    const s = typeof v === 'string' ? v : JSON.stringify(v)
    return s.length > max ? s.slice(0, max) + '…' : s
  } catch {
    return String(v)
  }
}

function classifyGraphError(e: any) {
  // ✅ handle raw string errors from util_fb_comments
  const rawMsg =
    typeof e === 'string'
      ? e
      : e?.message ||
        e?.error?.message ||
        e?.response?.data?.error?.message ||
        ''

  const code =
    (typeof e === 'object' &&
      (e?.code ?? e?.error?.code ?? e?.response?.data?.error?.code)) ||
    undefined
  const subcode =
    (typeof e === 'object' &&
      (e?.error_subcode ??
        e?.error?.error_subcode ??
        e?.response?.data?.error?.error_subcode)) ||
    undefined

  const nonExistent =
    /does not exist|cannot be loaded|unsupported get request/i.test(rawMsg) ||
    (code === 100 && (subcode === 33 || subcode === 24))

  const permission =
    /permissions|not authorized|requires.*access|(#200)/i.test(rawMsg) ||
    code === 200

  return { nonExistent, permission, msg: rawMsg, code, subcode }
}

// ---------------- lightweight types (swap to your own if you have them) ----------------
type I_supa_facebook_posts_row = {
  post_id: string
  page_id: string
  last_synced_at: string | null
  next_cursor: string | null
  sync_status: 'idle' | 'running' | 'deferred' | 'error'
  retry_count?: number | null
  last_error?: string | null
}
type I_supa_facebook_comments_insert = {
  comment_id: string
  post_id: string
  parent_id: string | null
  message: string | null
  from_id: string | null
  from_name: string | null
  from_picture_url: string | null
  created_time: string
  like_count: number | null
  comment_count: number | null
  permalink_url: string | null
  is_hidden: boolean
  is_deleted: boolean
  raw: any
  updated_at: string
}

// ---------------- core runner (extracted from your GET) ----------------
async function runReconcile() {
  const runId = crypto.randomUUID()
  const span = (s: string) => `[CRON ${runId}] ${s}`

  const isAuthorized = process.env.CRON_SECRET!
  const log: any[] = []
  const flush = (level: 'info' | 'warn' | 'error', msg: string, data?: any) => {
    ;(console as any)[level](msg, data ?? '')
    log.push({ ts: Date.now(), level, msg, data })
  }

  const t0 = Date.now()
  flush('info', span('START'), {
    envGraphVer: process.env.NEXT_PUBLIC_GRAPH_VERSION,
    concurrency: CONCURRENCY,
    batchSize: BATCH_SIZE,
    perPostBudgetMs: PER_POST_BUDGET_MS,
  })

  if (!isAuthorized) {
    flush('warn', span('AUTH_FAIL'))
    return { ok: false, status: 401, error: 'Unauthorized', log }
  }

  const supabase = await createAdmin()
  flush('info', span('SB_READY'))

  // Pick posts
  const pickStart = Date.now()
  const marker = `${NON_EXISTENT_MARKER}%` // 'tombstoned: non-existent/off-surface%'

  const { data: posts, error: postsErr } = await supabase
    .from('facebook_posts')
    .select('*')
    // include rows where last_error IS NULL OR last_error NOT ILIKE marker
    .or(`last_error.is.null,last_error.not.ilike.${marker}`)
    // include rows where retry_count IS NULL OR retry_count < 10
    .or('retry_count.is.null,retry_count.lt.10')
    .in('sync_status', ['idle', 'deferred', 'error'] as any)
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  if (postsErr) {
    console.error(span('PICK_POSTS_ERR'), { message: postsErr.message })
    console.timeEnd(span('TOTAL'))
    return NextResponse.json(
      { ok: false, error: postsErr.message },
      { status: 500 }
    )
  }

  flush('info', span('PICK_POSTS'), { ms: Date.now() - pickStart })

  flush('info', span('PICK_POSTS_OK'), {
    picked: posts?.length ?? 0,
    postIds: (posts ?? []).map((p) => p.post_id),
  })

  const limit = pLimit(CONCURRENCY)

  // Mark running
  if (posts?.length) {
    const ids = posts.map((p) => p.post_id)
    const mrStart = Date.now()
    const { error: updErr } = await supabase
      .from('facebook_posts')
      .update({ sync_status: 'running', last_error: null })
      .in('post_id', ids)
    flush('info', span('MARK_RUNNING'), { ms: Date.now() - mrStart })
    if (updErr) {
      flush('error', span('MARK_RUNNING_ERR'), { message: updErr.message })
    } else {
      flush('info', span('MARK_RUNNING_OK'), { ids })
    }
  }

  // Process all
  const paStart = Date.now()
  const results = await Promise.allSettled(
    (posts ?? []).map((p) =>
      limit(() =>
        reconcilePost(supabase, p as I_supa_facebook_posts_row, runId, flush)
      )
    )
  )
  flush('info', span('PROCESS_ALL'), { ms: Date.now() - paStart })

  const synced = results.filter(
    (r) => r.status === 'fulfilled' && r.value === true
  ).length
  const failed = results.filter(
    (r) => r.status === 'rejected' || r.value === false
  ).length

  flush('info', span('DONE'), {
    synced,
    failed,
    picked: posts?.length ?? 0,
    totalMs: Date.now() - t0,
  })

  return {
    ok: true,
    status: 200,
    runId,
    picked: posts?.length ?? 0,
    synced,
    failed,
    log,
  }
}

// ---------------- helpers (same logic as your route) ----------------
async function fetchCommentAuthorsByIds(
  commentIds: string[],
  pageAccessToken: string,
  size = 128,
  runId?: string,
  postId?: string
) {
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

    const t = Date.now()
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VER}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: pageAccessToken, batch }),
    })
    console.info(span(`BATCH_${i / chunkSize}_POST`), { ms: Date.now() - t })

    if (!res.ok) {
      const text = await res.text()
      console.warn(span('BATCH_HTTP_FAIL'), { status: res.status, text })
      continue
    }

    const json = (await res.json()) as Array<{ code: number; body: string }>
    let ok = 0
    let err = 0
    const samples: Array<{ id: string; body: any }> = []
    json.forEach((item, idx) => {
      try {
        const body = JSON.parse(item.body)
        if (samples.length < 3)
          samples.push({ id: chunk[idx], body: body?.from ?? body })
        if (item.code !== 200) {
          err++
          return
        }
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
    if (samples.length) {
      console.info(
        span('BATCH_SAMPLE_BODIES'),
        samples.map((s) => ({ id: s.id, body: trim(s.body, 400) }))
      )
    }
  }
  console.info(span('END'), { resolved: Object.keys(out).length })
  return out
}

async function reconcilePost(
  supabase: Awaited<ReturnType<typeof createAdmin>>,
  post: I_supa_facebook_posts_row,
  runId: string,
  log: (level: 'info' | 'warn' | 'error', msg: string, data?: any) => void
) {
  const postSpan = (s: string) => `[CRON ${runId}] [POST ${post.post_id}] ${s}`
  const startedAt = Date.now()
  const deadline = startedAt + PER_POST_BUDGET_MS
  log('info', postSpan('BEGIN'), {
    page_id: post.page_id,
    since: post.last_synced_at,
    prevCursor: post.next_cursor,
    budgetMs: PER_POST_BUDGET_MS,
  })

  // Resolve page token
  const tTok = Date.now()
  const { data: pageToken, error: tokErr } = await util_fb_pageToken({
    pageId: post.page_id,
  })
  log('info', postSpan('PAGE_TOKEN'), { ms: Date.now() - tTok })

  if (!pageToken || tokErr) {
    log('error', postSpan('PAGE_TOKEN_ERR'), { error: tokErr })
    await markPostError(
      supabase,
      post.post_id,
      `page token retrieval failed: ${tokErr?.message ?? 'no token'}`
    )
    return false
  } else {
    log('info', postSpan('PAGE_TOKEN_OK'), { tokenSuffix: pageToken.slice(-6) })
  }

  const since = post.last_synced_at ?? undefined
  let after: string | undefined = post.next_cursor ?? undefined

  const NEXT_PUBLIC_IDENTITY_ENABLED =
    (process.env.NEXT_PUBLIC_IDENTITY_ENABLED ?? 'false') === 'true'

  while (true) {
    if (Date.now() > deadline) {
      log('warn', postSpan('BUDGET_EXCEEDED'), { after })
      await deferPost(supabase, post.post_id, after)
      return false
    }

    const tFetch = Date.now()
    const { data, paging, error } = await util_fb_comments({
      postId: post.post_id,
      pageAccessToken: pageToken,
      order: 'chronological',
      identityEnabled: NEXT_PUBLIC_IDENTITY_ENABLED,
      ...(since ? { since } : {}),
      ...(after ? { after } : {}),
    })
    log('info', postSpan('FETCH_COMMENTS'), { ms: Date.now() - tFetch })

    if (error) {
      const { nonExistent, permission, msg, code, subcode } =
        classifyGraphError(error)
      log('error', postSpan('FETCH_ERR'), { error, msg, code, subcode })

      if (nonExistent) {
        await supabase
          .from('facebook_posts')
          .update({
            sync_status: 'idle',
            next_cursor: null,
            retry_count: 0,
            last_error: NON_EXISTENT_MARKER,
            last_synced_at: new Date().toISOString(),
          })
          .eq('post_id', post.post_id)
        return false
      }

      if (permission) {
        await markPostError(supabase, post.post_id, 'permissions error')
        return false
      }
      await markPostError(supabase, post.post_id, `util_fb_comments error`)
      return false
    }

    if (data?.length) {
      // quick stats preview
      log('info', postSpan('FETCH_OK_VERBOSE'), {
        count: data.length,
        stats: {
          withFrom: data.filter((c) => !!c.from).length,
          withFromId: data.filter((c) => !!c.from?.id).length,
          withFromName: data.filter((c) => !!c.from?.name).length,
          withPicture: data.filter((c) => !!c.from?.picture?.data?.url).length,
        },
        preview: data.slice(0, 5).map((c) => ({
          id: c.id,
          parent: c.parent?.id ?? null,
          from: c.from
            ? {
                id: c.from.id ?? null,
                name: c.from.name ?? null,
                has_pic: !!c.from?.picture?.data?.url,
              }
            : null,
          msg_len: c.message?.length ?? 0,
          created_time: c.created_time,
        })),
      })

      // Avatar enrich
      let avatarMap: Record<
        string,
        { url: string | null; isSilhouette: boolean | null }
      > = {}
      try {
        const fromIds = Array.from(
          new Set(data.map((c) => c.from?.id).filter((x): x is string => !!x))
        )
        log('info', postSpan('AVATAR_IDS'), { uniqueFromIds: fromIds.length })
        if (fromIds.length) {
          const tAva = Date.now()
          avatarMap = await util_fb_profile_picture({
            clIDs: fromIds,
            clAccessToken: pageToken,
            clImageDimensions: 128,
          })
          log('info', postSpan('AVATAR_ENRICH'), { ms: Date.now() - tAva })
          log('info', postSpan('AVATAR_DONE'), {
            resolved: Object.keys(avatarMap).length,
          })
        }
      } catch (e: any) {
        log('error', 'avatar batch fetch failed', {
          status: e?.response?.status,
          text: trim(e?.response?.data ?? e?.message, 700),
        })
      }

      // Fallback author fetch
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
        log('info', postSpan('FALLBACK_NEED'), { count: needsAuthor.length })
        if (needsAuthor.length) {
          authorFallback = await fetchCommentAuthorsByIds(
            needsAuthor,
            pageToken,
            128,
            runId,
            post.post_id
          )
          const resolvedNames = Object.values(authorFallback).filter(
            (v) => !!v.from_name
          ).length
          log('info', postSpan('FALLBACK_DONE'), {
            resolved: Object.keys(authorFallback).length,
            resolvedNames,
          })
        }
      } catch (e: any) {
        log('error', postSpan('FALLBACK_ERR'), { message: e?.message })
      }

      const rows: I_supa_facebook_comments_insert[] = data.map((c) => {
        const from_id = c.from?.id ?? authorFallback[c.id]?.from_id ?? null
        const from_name =
          c.from?.name ?? authorFallback[c.id]?.from_name ?? null
        const apiPic = (c as any)?.from?.picture?.data?.url ?? null
        const avatarPic = from_id ? avatarMap[from_id]?.url ?? null : null
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
          from_id,
          from_name,
          from_picture_url: apiPic ?? avatarPic ?? fallbackPic,
          created_time: createdISO,
          like_count: (c as any).like_count ?? null,
          comment_count: (c as any).comment_count ?? null,
          permalink_url: (c as any).permalink_url ?? null,
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
        log('info', postSpan('UPSERT_CHUNK'), {
          index: i / chunkSize,
          size: chunk.length,
        })
        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)
        if (upErr) {
          log('error', postSpan('UPSERT_ERR'), {
            message: upErr.message,
            index: i / chunkSize,
            size: chunk.length,
          })
          await markPostError(
            supabase,
            post.post_id,
            `comments upsert error: ${upErr.message}`
          )
          return false
        }
      }
      log('info', postSpan('UPSERT_OK'), { total: rows.length })
    } else {
      log('info', postSpan('NO_DATA_PAGE'))
    }

    const nextAfter = (paging as any)?.cursors?.after
    log('info', postSpan('CURSOR_UPDATE'), { next_after: nextAfter ?? null })
    await supabase
      .from('facebook_posts')
      .update({ next_cursor: nextAfter ?? null })
      .eq('post_id', post.post_id)

    if (!nextAfter) {
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
        log('error', postSpan('FINALIZE_ERR'), { message: updErr.message })
        await markPostError(
          supabase,
          post.post_id,
          `last_synced_at update failed: ${updErr.message}`
        )
        return false
      }

      log('info', postSpan('END_OK'))
      return true
    }

    // continue loop
    after = nextAfter
  }
}

async function deferPost(
  supabase: Awaited<ReturnType<typeof createAdmin>>,
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

const RETRY_MAX = 10

async function markPostError(
  supabase: Awaited<ReturnType<typeof createAdmin>>,
  post_id: string,
  message: string
) {
  const current = await getCurrentRetry(supabase, post_id)
  const next = (current ?? 0) + 1
  await supabase
    .from('facebook_posts')
    .update({
      sync_status: next >= RETRY_MAX ? 'idle' : 'error',
      retry_count: next,
      last_error: message.slice(0, 1000),
      ...(next >= RETRY_MAX
        ? { last_synced_at: new Date().toISOString() }
        : {}),
    })
    .eq('post_id', post_id)
}

async function getCurrentRetry(
  supabase: Awaited<ReturnType<typeof createAdmin>>,
  post_id: string
): Promise<number> {
  const { data } = await supabase
    .from('facebook_posts')
    .select('retry_count')
    .eq('post_id', post_id)
    .maybeSingle()
  return data?.retry_count ?? 0
}

// ---------------- PAGE ----------------
export default async function Page() {
  await runReconcile() // don't return anything

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reconcile Comments — Test Page</h1>

      {/* Result block */}
      {/* The server action returns data that will hydrate here after submit */}
      <ActionResult />
    </div>
  )
}

// This is a tiny async server component “slot” that gets re-rendered after the action.
// It will be replaced by Next with the action’s returned payload.
async function ActionResult() {
  // Nothing to render initially; after submit, Next will stream the result above into the tree.
  return null
}
