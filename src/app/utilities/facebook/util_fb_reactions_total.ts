'use server'

import { util_fb_pageToken } from './util_fb_pageToken'

export const util_fb_reactions_total = async (postId: string) => {
  const { data: token } = await util_fb_pageToken({
    pageId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
  })
  if (!token) throw new Error('Missing Page token')

  const v = process.env.NEXT_PUBLIC_GRAPH_VERSION!
  const url = new URL(`https://graph.facebook.com/${v}/${postId}`)
  url.searchParams.set('fields', 'reactions.summary(total_count).limit(0)')
  url.searchParams.set('access_token', token)

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())

  const json = (await res.json()) as {
    reactions?: { summary?: { total_count?: number } }
  }

  return {
    totalReactions: json.reactions?.summary?.total_count ?? 0,
    raw: json,
  }
}
