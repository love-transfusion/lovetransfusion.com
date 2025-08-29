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

export async function getPostIdFromAd(adId: string, systemToken: string) {
  const { data } = await axios.get(`https://graph.facebook.com/v23.0/${adId}`, {
    params: {
      access_token: systemToken,
      fields: 'creative{effective_object_story_id,object_story_id}',
    },
  })
  const postId =
    data?.creative?.effective_object_story_id ?? data?.creative?.object_story_id

  if (!postId) throw new Error('No object_story_id found for this ad')
  return postId as string
}

export async function getPageAccessToken(pageId: string, systemToken: string) {
  const { data } = await axios.get(
    `https://graph.facebook.com/v23.0/${pageId}`,
    {
      params: { access_token: systemToken, fields: 'access_token' },
    }
  )
  const pageToken = data?.access_token
  if (!pageToken)
    throw new Error('Could not fetch Page Access Token. Check perms.')
  return pageToken as string
}

type Order = 'chronological' | 'reverse_chronological'

export async function fetchCommentsForPost(options: {
  postId: string
  pageToken: string
  limit?: number
  after?: string
  since?: string | number
  until?: string | number
  order?: Order
}) {
  const {
    postId,
    pageToken,
    limit = 100,
    after,
    since,
    until,
    order = 'chronological',
  } = options

  const params: Record<string, string> = {
    access_token: pageToken,
    fields: [
      'id',
      'message',
      'created_time',
      'like_count',
      'comment_count',
      'from{name,id}',
    ].join(','),
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
export async function fetchAdComments(options: {
  adId: string
  pageId: string
  limit?: number
  after?: string
  since?: string | number
  until?: string | number
  order?: Order
}) {
  const systemToken = process.env.FACEBOOK_SYSTEM_TOKEN
  if (!systemToken)
    return {
      data: null,
      paging: undefined,
      error: 'FACEBOOK_SYSTEM_TOKEN is missing',
    }

  try {
    // 1) Ad -> Page Post ID
    const postId = await getPostIdFromAd(options.adId, systemToken)

    // 2) System -> Page token
    const pageToken = await getPageAccessToken(options.pageId, systemToken)

    // 3) Post comments (with Page token)
    return await fetchCommentsForPost({
      postId,
      pageToken,
      limit: options.limit,
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
