'use server'

import axios from 'axios'

export async function util_getFBPostID(options: {
  adId: string
  systemToken: string
}) {
  const { data } = await axios.get(
    `https://graph.facebook.com/v23.0/${options.adId}`,
    {
      params: {
        access_token: options.systemToken,
        fields: 'creative{effective_object_story_id,object_story_id}',
      },
    }
  )
  const postId =
    data?.creative?.effective_object_story_id ?? data?.creative?.object_story_id

  if (!postId) throw new Error('No object_story_id found for this ad')
  return postId as string
}
