/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

export const sa_run_insights_route = async (args: { origin: string }) => {
  const url = `${args.origin}/api/cron/insights`
  console.log({ url })
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET ?? ''}`,
    },
    cache: 'no-store',
  })

  const text = await res.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }

  return {
    ok: res.ok,
    status: res.status,
    url,
    data: json,
    text: json ? null : text,
  }
}

const safeJson = async (res: Response) => {
  const text = await res.text()
  try {
    return { json: text ? JSON.parse(text) : null, text }
  } catch {
    return { json: null, text }
  }
}

export const sa_debug_page_token = async () => {
  const token = process.env.FACEBOOK_PAGE_TOKEN
  const graph = process.env.NEXT_PUBLIC_GRAPH_VERSION ?? 'v22.0'
  if (!token) return { ok: false, error: 'Missing FACEBOOK_PAGE_TOKEN' }

  // /me with a page token should return the Page id/name
  const url = `https://graph.facebook.com/${graph}/me?fields=id,name&access_token=${encodeURIComponent(
    token,
  )}`

  const res = await fetch(url, { method: 'GET' })
  const { json, text } = await safeJson(res)

  return { ok: res.ok, status: res.status, url, json, text: json ? null : text }
}

export const sa_test_reactions_for_post = async (args: { postId: string }) => {
  const token = process.env.FACEBOOK_PAGE_TOKEN
  const graph = process.env.NEXT_PUBLIC_GRAPH_VERSION ?? 'v22.0'
  if (!token) return { ok: false, error: 'Missing FACEBOOK_PAGE_TOKEN' }
  if (!args.postId) return { ok: false, error: 'Missing postId' }

  const url =
    `https://graph.facebook.com/${graph}/${encodeURIComponent(args.postId)}` +
    `/reactions?summary=total_count&limit=0&access_token=${encodeURIComponent(
      token,
    )}`

  const res = await fetch(url, { method: 'GET' })
  const { json, text } = await safeJson(res)

  return { ok: res.ok, status: res.status, url, json, text: json ? null : text }
}
