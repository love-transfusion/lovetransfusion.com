'use server'
import {
  env_FACEBOOK_GRAPH_VERSION,
  env_FACEBOOK_IDENTITY_ENABLED,
} from '@/app/lib/facebook/constants'
import axios from 'axios'

export type Order = 'chronological' | 'reverse_chronological'

export type FBComment_V2 = {
  id: string
  message?: string
  created_time: string
  permalink_url?: string
  like_count?: number
  comment_count?: number
  parent?: { id: string }
  from?: { name: string; id: string; picture?: { data?: { url?: string } } }
}

export async function util_fb_comments(options: {
  postId: string
  pageAccessToken: string
  limit?: number
  after?: string
  since?: string | number
  until?: string | number
  order?: Order
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
    identityEnabled = env_FACEBOOK_IDENTITY_ENABLED, // default from env
  } = options

  const fields = [
    'id',
    'message',
    'created_time',
    'permalink_url',
    ...(identityEnabled ? ['from{id,name,picture{url}}'] : []),
  ].join(',')

  const params: Record<string, string> = {
    access_token: pageAccessToken,
    fields,
    limit: String(limit),
    order,
    ...(after ? { after } : {}),
    ...(since ? { since: String(since) } : {}),
    ...(until ? { until: String(until) } : {}),
  }

  const { data } = await axios.get(
    `https://graph.facebook.com/${env_FACEBOOK_GRAPH_VERSION}/${postId}/comments`,
    { params }
  )

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
}
