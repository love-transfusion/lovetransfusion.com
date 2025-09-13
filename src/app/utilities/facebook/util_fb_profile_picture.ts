export const util_fb_profile_picture = async (options: {
  clIDs: string[]
  clAccessToken: string
  clImageDimensions?: number
}): Promise<
  Record<string, { url: string | null; isSilhouette: boolean | null }>
> => {
  if (!options.clIDs.length) return {}
  const dimentions = options.clImageDimensions ?? 128
  const unique = Array.from(new Set(options.clIDs.filter(Boolean)))
  const chunkSize = 50 // keep it small; Graph allows large ids lists but be polite
  const out: Record<
    string,
    { url: string | null; isSilhouette: boolean | null }
  > = {}

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize)
    const url = new URL('https://graph.facebook.com/v20.0/')
    url.searchParams.set('ids', chunk.join(','))
    url.searchParams.set(
      'fields',
      `picture.height(${dimentions}).width(${dimentions}){url,is_silhouette}`
    )
    url.searchParams.set('access_token', options.clAccessToken)

    const res = await fetch(url.toString())
    if (!res.ok) {
      console.error('avatar batch fetch failed', {
        status: res.status,
        text: await res.text(),
      })
      continue
    }
    const data = (await res.json()) as Record<
      string,
      { picture?: { data?: { url?: string; is_silhouette?: boolean } } }
    >
    for (const id of chunk) {
      const url = data?.[id]?.picture?.data?.url ?? null
      const isSil = data?.[id]?.picture?.data?.is_silhouette ?? null
      out[id] = { url, isSilhouette: isSil }
    }
  }
  return out
}
