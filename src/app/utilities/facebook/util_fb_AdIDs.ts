/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

/**
 * Returns ALL Ad IDs that reference the given Page Post ID via creative.effective_object_story_id.
 * Paginates through all ads in the account.
 */
export const util_fb_AdIDs = async (postId: string): Promise<string[]> => {
  const accessToken = process.env.FACEBOOK_SYSTEM_TOKEN!
  const accountId = '3519590174999724'
  const base = `https://graph.facebook.com/v23.0/act_${accountId}/ads`
  const params = new URLSearchParams({
    fields: 'id,creative{effective_object_story_id}',
    limit: '500',
  })

  let url = `${base}?${params.toString()}`
  const found = new Set<string>()

  while (url) {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Ads list failed: ${await res.text()}`)
    const json = await res.json()

    const data: any[] = Array.isArray(json.data) ? json.data : []

    for (const ad of data) {
      const eff = ad?.creative?.effective_object_story_id
      if (eff === postId && ad?.id) {
        found.add(String(ad.id))
      }
    }

    const next = json?.paging?.next as string | undefined
    url = next || ''
  }

  return [...found]
}
