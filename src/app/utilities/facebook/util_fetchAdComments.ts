/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/fb/comments.ts
'use server'

import axios from 'axios'

type FBComment = {
  id: string
  message?: string
  created_time: string
  like_count?: number
  comment_count?: number
  parent?: { id: string } // only when flatten=true
  from?: { name: string; id: string }
}

type Order = 'chronological' | 'reverse_chronological'

export async function fetchCommentsForPost(options: {
  postId: string
  pageAccessToken: string
  limit?: number
  after?: string
  since?: string | number
  until?: string | number
  order?: Order
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

  const params: Record<string, string> = {
    access_token: pageAccessToken,
    fields: ['id', 'message', 'created_time', 'from{name,id}'].join(','),
    limit: String(limit),
  }
  if (after) params.after = after
  if (since) params.since = String(since)
  if (until) params.until = String(until)
  params.order = order

  const { data } = await axios.get(
    `https://graph.facebook.com/v23.0/${postId}/comments`,
    { params }
  )

  if (data?.error?.message) {
    return {
      data: null as FBComment[] | null,
      paging: undefined,
      error: data.error.message as string,
    }
  }

  return {
    data: (data?.data ?? []) as FBComment[],
    paging: data?.paging as
      | { cursors?: { after?: string; before?: string }; next?: string }
      | undefined,
    error: null as string | null,
  }
}

/**
 * One-call wrapper: Ad ID -> Post ID -> Page Token -> Comments
 */
export async function util_fetchAdComments(options: {
  /**Only one of the recipients' ad IDs is needed. */
  postID: string
  pageAccessToken: string
  limit?: number
  after?: string
  since?: string | number
  until?: string | number
  order?: Order
}) {
  const newLimit = options.limit ?? 10000000
  try {
    // 3) Post comments (with Page token)
    return await fetchCommentsForPost({
      postId: options.postID,
      pageAccessToken: options.pageAccessToken,
      limit: newLimit,
      after: options.after,
      since: options.since,
      until: options.until,
      order: options.order,
    })
  } catch (e: any) {
    return {
      data: null,
      paging: undefined,
      error: e?.message ?? 'Unknown error',
    }
  }
}
