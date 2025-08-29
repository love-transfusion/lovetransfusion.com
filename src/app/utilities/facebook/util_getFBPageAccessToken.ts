'use server'

import axios from 'axios'

export async function util_getFBPageAccessToken(options: {
  pageId: string
  systemToken: string
}) {
  const { data } = await axios.get(
    `https://graph.facebook.com/v23.0/${options.pageId}`,
    {
      params: { access_token: options.systemToken, fields: 'access_token' },
    }
  )
  const pageToken = data?.access_token
  if (!pageToken)
    throw new Error('Could not fetch Page Access Token. Check perms.')
  return pageToken as string
}
