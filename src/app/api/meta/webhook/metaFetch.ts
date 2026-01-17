/* eslint-disable @typescript-eslint/no-explicit-any */

type T_usageHeaders = {
  app?: any
  page?: any
  business?: any
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const safeJsonParse = (v: string | null) => {
  if (!v) return null
  try {
    return JSON.parse(v)
  } catch {
    return v
  }
}

const readUsageHeaders = (res: Response): T_usageHeaders => {
  // Meta commonly returns these headers (sometimes not present)
  const app = safeJsonParse(res.headers.get('x-app-usage'))
  const page = safeJsonParse(res.headers.get('x-page-usage'))
  const business = safeJsonParse(res.headers.get('x-business-use-case-usage'))
  return { app, page, business }
}

const isRetryableStatus = (status: number) =>
  status === 429 || status === 500 || status === 502 || status === 503 || status === 504

const jitter = (ms: number) => Math.floor(ms * (0.75 + Math.random() * 0.5))

export const metaFetchJson = async <T = any>(args: {
  url: string
  init?: RequestInit
  // optional label for logging
  label?: string
  // retries for 429/5xx
  retries?: number
  // base delay ms
  baseDelayMs?: number
}): Promise<{
  ok: boolean
  status: number
  data: T | null
  text: string | null
  usage: T_usageHeaders
}> => {
  const {
    url,
    init,
    label = 'META_FETCH',
    retries = 3,
    baseDelayMs = 400,
  } = args

  let attempt = 0
  let lastText: string | null = null

  while (attempt <= retries) {
    const res = await fetch(url, init)
    const usage = readUsageHeaders(res)

    // helpful for debugging rate limits
    if (attempt === 0 || res.status === 429) {
      console.info(`[${label}] response`, {
        status: res.status,
        usage,
      })
    }

    const text = await res.text()
    lastText = text

    const asJson = (() => {
      try {
        return text ? (JSON.parse(text) as T) : (null as any)
      } catch {
        return null
      }
    })()

    if (res.ok) {
      return { ok: true, status: res.status, data: asJson, text, usage }
    }

    // non-retryable
    if (!isRetryableStatus(res.status)) {
      return { ok: false, status: res.status, data: asJson, text, usage }
    }

    // retryable
    if (attempt >= retries) {
      return { ok: false, status: res.status, data: asJson, text, usage }
    }

    // if Retry-After exists, respect it (seconds)
    const retryAfter = res.headers.get('retry-after')
    const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : 0

    const delay = Math.max(retryAfterMs, jitter(baseDelayMs * 2 ** attempt))
    console.warn(`[${label}] retrying`, {
      attempt,
      status: res.status,
      delay,
      snippet: text?.slice(0, 200),
    })
    await sleep(delay)
    attempt++
  }

  return { ok: false, status: 0, data: null, text: lastText, usage: {} }
}
