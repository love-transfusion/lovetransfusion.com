'use server'

import { createAdmin } from '../config/supabase/supabaseAdmin'

export const selectandupdatefacebookposts = async () => {
  const supabase = await createAdmin()
  try {
    const { data: post_ids, error } = await supabase
      .from('facebook_posts')
      .select('post_id')
    console.log({ post_ids })

    if (!!(post_ids ?? []).length) {
      await Promise.all(
        (post_ids ?? []).map(async (item) => {
          await supabase
            .from('facebook_posts')
            .update({ last_synced_at: null })
            .eq('post_id', item.post_id)
        })
      )
    }

    if (error) throw new Error(error.message)
    return { data: post_ids, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
