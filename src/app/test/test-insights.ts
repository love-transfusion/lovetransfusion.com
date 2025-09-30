'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { util_fb_pageToken } from '../utilities/facebook/util_fb_pageToken'

const V = 'v22.0'
const G = `https://graph.facebook.com/${V}`
const PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!

type ReactionsByType = Partial<{
  like: number
  love: number
  care: number
  wow: number
  haha: number
  sad: number
  angry: number
}>

export async function fb_fetchPostInsights(postId: string) {
  const { data: pageToken } = await util_fb_pageToken({ pageId: PAGE_ID })

  // 1) Preflight: confirm Page-ownership + post metadata
  const meta = await axios.get(`${G}/${postId}`, {
    params: {
      fields: [
        'id',
        'from{id,name}',
        'status_type',
        'is_published',
        'permalink_url',
        'created_time',
      ].join(','),
      access_token: pageToken,
    },
    timeout: 15000,
  })

  // console.log({ meta })

  const fromId: string | undefined = meta.data?.from?.id
  if (fromId && fromId !== PAGE_ID) {
    return {
      postId,
      reactionsByType: {} as ReactionsByType,
      totalReactions: 0,
      impressionsTotal: 0,
      note: 'Post is not Page-owned (shared/reshared). Insights are unavailable for non-Page-owned posts.',
      meta: {
        from: meta.data?.from,
        status_type: meta.data?.status_type,
        permalink_url: meta.data?.permalink_url,
      },
    }
  }

  // 2) Fetch insights with explicit lifetime period
  const metrics = ['post_reactions_by_type_total', 'post_impressions'].join(',')

  const r = await axios.get(`${G}/${postId}/insights`, {
    params: {
      metric: metrics,
      period: 'lifetime',
      access_token: pageToken,
    },
    timeout: 20000,
  })

  const rows: Array<{ name: string; values?: Array<{ value: any }> }> =
    r.data?.data ?? []
  const reactionsObj: ReactionsByType =
    rows.find((d) => d.name === 'post_reactions_by_type_total')?.values?.[0]
      ?.value ?? {}

  const impressionsTotal: number = Number(
    rows.find((d) => d.name === 'post_impressions')?.values?.[0]?.value ?? 0
  )

  const totalReactions = Object.values(reactionsObj).reduce(
    (s, v) => s + (typeof v === 'number' ? v : 0),
    0
  )

  // 3) If still empty, return a helpful note
  let note: string | undefined
  if ((rows?.length ?? 0) === 0) {
    note =
      'Insights returned empty. Likely unsupported metrics for this post type or post not yet eligible.'
  }

  return {
    postId,
    reactionsByType: reactionsObj,
    totalReactions,
    impressionsTotal,
    note,
  }
}
