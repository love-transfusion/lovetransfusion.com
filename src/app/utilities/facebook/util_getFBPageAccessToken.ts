'use server'

import { env_FACEBOOK_SYSTEM_TOKEN } from '@/app/lib/_env_constants/constants.server'
import axios from 'axios'

export async function util_getFBPageAccessToken(options: {
  pageId: string
  systemToken?: string
}) {
  const token = options.systemToken ?? env_FACEBOOK_SYSTEM_TOKEN

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v23.0/${options.pageId}`,
      {
        params: { access_token: token, fields: 'access_token' },
      }
    )
    const pageToken = data?.access_token as string
    if (!pageToken)
      throw new Error('Could not fetch Page Access Token. Check perms.')
    return { data: pageToken, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
