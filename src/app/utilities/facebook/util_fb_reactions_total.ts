/* eslint-disable @typescript-eslint/no-explicit-any */

type T_fbReactionsTotalOk = {
  totalReactions: number
}

type T_fbReactionsTotalErr = {
  message: string
  status?: number
  code?: number
  error_subcode?: number
  raw?: any

  // ✅ added
  is_non_retryable: boolean
  reason:
    | 'unsupported'
    | 'permission'
    | 'rate_limit'
    | 'unknown'
    | 'bad_request'
}

type T_fbReactionsTotalRes =
  | { data: T_fbReactionsTotalOk; error: null }
  | { data: null; error: T_fbReactionsTotalErr }

const safeJson = async (res: Response) => {
  const text = await res.text()
  try {
    return { json: text ? JSON.parse(text) : null, text }
  } catch {
    return { json: null, text }
  }
}

const classifyGraphError = (args: {
  status?: number
  code?: number
  subcode?: number
  message?: string
}): { is_non_retryable: boolean; reason: T_fbReactionsTotalErr['reason'] } => {
  const status = args.status
  const code = args.code
  const subcode = args.subcode
  const msg = (args.message ?? '').toLowerCase()

  // Rate limit / throttling (retryable)
  const isRateLimit =
    status === 429 ||
    code === 4 ||
    code === 17 ||
    code === 32 ||
    /rate limit|too many calls|user request limit reached|please wait/.test(msg)

  if (isRateLimit) {
    return { is_non_retryable: false, reason: 'rate_limit' }
  }

  // Common "non-existent/off-surface/unsupported get request"
  // e.g. code=100 subcode=33
  const isUnsupported =
    code === 100 &&
    (subcode === 33 ||
      /unsupported get request|does not exist|cannot be loaded/.test(msg))

  if (isUnsupported) {
    return { is_non_retryable: true, reason: 'unsupported' }
  }

  // Permission-ish cases (often not fixable per-run)
  // e.g. requires pages_read_engagement / page public content access
  const isPermission =
    code === 10 ||
    /missing permission|not authorized|requires.*permission|page public content access|pages_read_engagement/.test(
      msg,
    )

  if (isPermission) {
    return { is_non_retryable: true, reason: 'permission' }
  }

  // Bad request (usually non-retryable unless you change params)
  if (status && status >= 400 && status < 500) {
    return { is_non_retryable: true, reason: 'bad_request' }
  }

  // Otherwise, treat as unknown (could be transient)
  return { is_non_retryable: false, reason: 'unknown' }
}

export const util_fb_reactions_total = async (args: {
  postId: string
  graphVersion?: string // optional override
}): Promise<T_fbReactionsTotalRes> => {
  const GRAPH =
    args.graphVersion ?? process.env.NEXT_PUBLIC_GRAPH_VERSION ?? 'v22.0'

  if (!args.postId)
    return {
      data: null,
      error: {
        message: 'Missing postId',
        is_non_retryable: true,
        reason: 'bad_request',
      },
    }

  const pageAccessToken = process.env.FACEBOOK_PAGE_TOKEN!
  const url =
    `https://graph.facebook.com/${GRAPH}/${encodeURIComponent(args.postId)}` +
    `/reactions?summary=total_count&limit=0&access_token=${encodeURIComponent(
      pageAccessToken,
    )}`

  const res = await fetch(url, { method: 'GET' })
  const { json, text } = await safeJson(res)

  if (!res.ok) {
    const e = (json as any)?.error ?? json ?? null

    const message =
      e?.message ??
      `Graph error (status ${res.status})` +
        (text ? `: ${String(text).slice(0, 250)}` : '')

    const code = e?.code as number | undefined
    const error_subcode = e?.error_subcode as number | undefined

    const classified = classifyGraphError({
      status: res.status,
      code,
      subcode: error_subcode,
      message,
    })

    return {
      data: null,
      error: {
        message,
        status: res.status,
        code,
        error_subcode,
        raw: json ?? text,

        // ✅ added
        is_non_retryable: classified.is_non_retryable,
        reason: classified.reason,
      },
    }
  }

  const total = (json as any)?.summary?.total_count
  return {
    data: { totalReactions: typeof total === 'number' ? total : 0 },
    error: null,
  }
}
