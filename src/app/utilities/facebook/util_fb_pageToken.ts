'use server'
import axios from 'axios'

const pageTokenCache = new Map<string, { token: string; expiresAt: number }>()

export const util_fb_pageToken = async () => {
  const now = Date.now()
  const pageID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!
  const cached = pageTokenCache.get(pageID)

  if (cached && cached.expiresAt > now) {
    return { data: cached.token, error: null }
  }

  const systemToken = process.env.FACEBOOK_SYSTEM_TOKEN!
  const { data } = await axios.get(
    `https://graph.facebook.com/${process.env.NEXT_PUBLIC_GRAPH_VERSION!}/${pageID}`,
    { params: { access_token: systemToken, fields: 'access_token' } },
  )

  const pageToken = data?.access_token as string | undefined
  if (!pageToken) {
    return {
      data: null,
      error: 'Could not fetch Page Access Token. Check perms.',
    }
  }

  // cache for 6 hours (tune as you like)
  pageTokenCache.set(pageID, {
    token: pageToken,
    expiresAt: now + 6 * 60 * 60 * 1000,
  })

  return { data: pageToken, error: null }
}
