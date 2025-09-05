'use server'

export async function util_fb_sync_new_comments() {
  const host = process.env.NEXT_PUBLIC_ROOT_DOMAIN!

  const res = await fetch(`${host}/api/cron/reconcile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET!}`,
    },
    // avoid caching
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cron failed: ${res.status} ${text}`)
  }
  return res.json()
}
