'use server'
import {
  env_FACEBOOK_GRAPH_VERSION,
  env_FACEBOOK_SYSTEM_TOKEN,
} from '@/app/lib/_env_constants/constants.client'
import axios from 'axios'

export async function util_fb_postID(opts: {
  adId: string
  systemToken?: string
}) {
  const token = env_FACEBOOK_SYSTEM_TOKEN
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/${env_FACEBOOK_GRAPH_VERSION}/${opts.adId}`,
      {
        params: {
          access_token: token,
          fields: 'creative{effective_object_story_id,object_story_id}',
        },
      }
    )
    const postId =
      data?.creative?.effective_object_story_id ??
      data?.creative?.object_story_id
    if (!postId)
      return { data: null, error: 'No object_story_id found for this ad' }
    return { data: postId as string, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { data: null, error: e?.message ?? 'Unknown error' }
  }
}