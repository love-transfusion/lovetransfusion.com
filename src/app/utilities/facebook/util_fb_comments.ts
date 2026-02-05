'use server'
import axios, { isAxiosError } from 'axios'

export type Order = 'chronological' | 'reverse_chronological'

export type FBComment_V2 = {
  id: string
  message?: string
  created_time: string
  permalink_url?: string
  like_count?: number
  comment_count?: number
  parent?: { id: string }
  from?: {
    id: string
    name: string
    picture?: { data?: { url?: string; is_silhouette?: boolean } }
  }
}

export async function util_fb_comments(options: {
  postId: string
  pageAccessToken: string
  limit?: number
  after?: string
  since?: string | number
  until?: string | number
  order?: Order
  // keep the option for compatibility, but it no longer gates 'from{...}'
  identityEnabled?: boolean
}) {
  const {
    postId,
    pageAccessToken,
    limit = 100,
    after,
    since,
    until,
    order = 'chronological',
  } = options

  const token = (pageAccessToken ?? '').trim()

  if (!token || token.length < 50) {
    return {
      data: null,
      paging: undefined,
      error: 'Missing/invalid token value.',
    }
  }

  // Always request author + parent + counts + a decent avatar size
  const fields = [
    'id',
    'message',
    'created_time',
    'permalink_url',
    'like_count',
    'comment_count',
    'parent{id}',
    // request picture with explicit dimensions for consistent URLs
    'from{id,name,picture.height(128).width(128){url,is_silhouette}}',
  ].join(',')

  const params: Record<string, string> = {
    access_token: token,
    fields,
    limit: String(limit),
    order,
    ...(after ? { after } : {}),
    ...(since ? { since: String(since) } : {}),
    ...(until ? { until: String(until) } : {}),
  }

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/${process.env
        .NEXT_PUBLIC_GRAPH_VERSION!}/${postId}/comments`,
      { params },
    )

    // Graph-level error (200 with error payload)
    if (data?.error?.message) {
      return {
        data: null as FBComment_V2[] | null,
        paging: undefined,
        error: data.error.message as string,
      }
    }

    return {
      data: (data?.data ?? []) as FBComment_V2[],
      paging: data?.paging as
        | { cursors?: { after?: string; before?: string }; next?: string }
        | undefined,
      error: null as string | null,
    }
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const msg =
        err.response?.data?.error?.message ??
        err.response?.statusText ??
        err.message
      return { data: null, paging: undefined, error: msg }
    }
    return {
      data: null,
      paging: undefined,
      error: (err as Error)?.message ?? 'Unknown error',
    }
  }
}
