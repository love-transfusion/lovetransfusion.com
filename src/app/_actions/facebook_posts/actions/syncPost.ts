/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_comments } from '@/app/utilities/facebook/new/util_fb_comments'
import { util_fb_pageToken } from '@/app/utilities/facebook/new/util_fb_pageToken'

export async function syncPostNow(postId: string, pageId: string) {
  const supabase = await createAdmin()

  const { data: pageToken } = await util_fb_pageToken({ pageId })
  if (!pageToken) return { ok: false, error: 'No page token' }

  let after: string | undefined
  do {
    const { data, paging, error } = await util_fb_comments({
      postId,
      pageAccessToken: pageToken,
      order: 'chronological',
      identityEnabled: false,
      ...(after ? { after } : {}),
    })
    if (error) return { ok: false, error }
    if (data?.length) {
      await supabase.from('facebook_comments').upsert(
        data.map((c) => ({
          comment_id: c.id,
          post_id: postId,
          parent_id: c.parent?.id ?? null,
          message: c.message ?? null,
          from_id: c.from?.id ?? null,
          from_name: c.from?.name ?? null,
          from_picture_url: (c as any)?.from?.picture?.data?.url ?? null,
          created_time: c.created_time,
          like_count: c.like_count ?? null,
          comment_count: c.comment_count ?? null,
          permalink_url: c.permalink_url ?? null,
          is_hidden: false,
          is_deleted: false,
          raw: c,
          updated_at: new Date().toISOString(),
        })) as any,
        { onConflict: 'comment_id' } as any
      )
    }
    after = paging?.cursors?.after
  } while (after)

  await supabase
    .from('facebook_posts')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('post_id', postId)
  return { ok: true }
}
