/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_postID } from '@/app/utilities/facebook/new/util_fb_postID'

export async function seedPostFromAd(
  adId: string,
  pageId: string,
  user_Id: string
) {
  const supabase = await createAdmin()
  const { data: postId, error } = await util_fb_postID({ adId })
  if (!postId) return { ok: false, error: error ?? 'Could not resolve postId' }

  const { error: upErr } = await supabase.from('facebook_posts').upsert(
    {
      post_id: postId,
      page_id: pageId,
      ad_id: adId,
      last_synced_at: null, // first reconcile will populate
      created_at: null, // ok if DB has DEFAULT now()
      user_id: user_Id,
    } as any,
    { onConflict: 'post_id' } as any
  )

  return { ok: !upErr, postId, error: upErr?.message }
}
