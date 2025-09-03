'use server'

import axios from 'axios'

export async function util_getFBPostID(options: {
  adId: string
  systemToken?: string
}) {
  const token = options.systemToken ?? process.env.FACEBOOK_SYSTEM_TOKEN!

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v23.0/${options.adId}`,
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
    if (!postId) throw new Error('No object_story_id found for this ad')

    return { data: postId as string, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
