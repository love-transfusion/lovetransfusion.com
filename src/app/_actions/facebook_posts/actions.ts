'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { isAdmin } from '@/app/lib/adminCheck'

export const supa_update_facebook_posts = async (
  post: I_supa_facebook_posts_insert
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
  if (!isadmin) throw new Error('You are not authorized.')

  const supabase = await createAdmin()

  try {
    const { error } = await supabase
      .from('facebook_posts')
      .upsert(post, { onConflict: 'user_id' })
    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}