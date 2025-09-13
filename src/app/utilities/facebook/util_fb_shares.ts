/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/fb/shares.ts
'use server'

import axios from 'axios'

export type FBShareCount = {
  count: number
}

/** Get share count for a Page post. Note: if there are zero shares, the `shares` field is absent. */
export async function getShareCountForPost(opts: {
  postId: string
  pageToken: string
}): Promise<{ count: number; error: string | null }> {
  const { postId, pageToken } = opts
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v23.0/${postId}`,
      {
        params: {
          access_token: pageToken,
          fields: 'shares', // returns { shares: { count } } when > 0
        },
      }
    )

    const count = Number(data?.shares?.count ?? 0)
    return { count: Number.isFinite(count) ? count : 0, error: null }
  } catch (e: any) {
    return {
      count: 0,
      error: e?.response?.data?.error?.message ?? e?.message ?? 'Unknown error',
    }
  }
}

/**
 * One-call wrapper: Ad ID -> Post ID -> Page Token -> Share count
 * Mirrors your fetchAdComments flow.
 */
export async function util_fb_shares(options: {
  postID: string
  pageAccessToken: string
}) {
  try {
    return await getShareCountForPost({
      postId: options.postID,
      pageToken: options.pageAccessToken,
    })
  } catch (e: any) {
    return { count: 0, error: e?.message ?? 'Unknown error' }
  }
}
