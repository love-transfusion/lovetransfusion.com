'use server'

import { FBComment_V2, Order, util_fb_comments } from './util_fb_comments'
import { util_fb_postID } from './util_fb_postID'

export async function util_fb_fetchBy(opts: {
  postId: string
  pageAccessToken: string
  limit?: number
  after?: string
  since?: string | number
  until?: string | number
  order?: Order
  identityEnabled?: boolean
}) {
  return util_fb_comments(opts)
}

export async function util_fetchAdComments(opts: {
  adId: string
  pageAccessToken: string
  limit?: number
  after?: string
  since?: string | number
  until?: string | number
  order?: Order
  identityEnabled?: boolean
  systemToken?: string
}) {
  const { data: postId, error } = await util_fb_postID({
    adId: opts.adId,
    systemToken: opts.systemToken,
  })
  if (!postId)
    return {
      data: null as FBComment_V2[] | null,
      paging: undefined,
      error: error ?? 'Could not resolve postId',
    }
  return util_fb_comments({ ...opts, postId })
}
