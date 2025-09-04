'use server'
import axios from 'axios'

export async function util_fb_pageToken(opts: {
  pageId: string
  systemToken?: string
}) {
  const token = process.env.FACEBOOK_SYSTEM_TOKEN!
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/${process.env.NEXT_PUBLIC_GRAPH_VERSION!}/${
        opts.pageId
      }`,
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
