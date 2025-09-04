'use server'
import {
  env_FACEBOOK_GRAPH_VERSION,
  env_FACEBOOK_SYSTEM_TOKEN,
} from '@/app/lib/_env_constants/constants.client'
import axios from 'axios'

export async function util_fb_pageToken(opts: {
  pageId: string
  systemToken?: string
}) {
  const token = env_FACEBOOK_SYSTEM_TOKEN
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/${env_FACEBOOK_GRAPH_VERSION}/${opts.pageId}`,
      { params: { access_token: token, fields: 'access_token' } }
    )
    const pageToken = data?.access_token as string
    if (!pageToken)
      return {
        data: null,
        error: 'Could not fetch Page Access Token. Check perms.',
      }
    return { data: pageToken, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { data: null, error: e?.message ?? 'Unknown error' }
  }
}
