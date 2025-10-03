'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { isAdmin } from '@/app/lib/adminCheck'

export const supa_upsert_facebook_posts = async (
  post: I_supa_facebook_posts_insert
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
  if (!isadmin) throw new Error('You are not authorized.')

  const supabase = await createAdmin()

  try {
    const { error } = await supabase
      .from('facebook_posts')
      .upsert(post, { onConflict: 'post_id' })
    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}

// export const supa_insert_facebook_posts = async (
//   post: I_supa_facebook_posts_insert
// ) => {
//   const user = await getCurrentUser()
//   const isadmin = isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
//   if (!isadmin) throw new Error('You are not authorized.')

//   const supabase = await createAdmin()

//   try {
//     const { error } = await supabase.from('facebook_posts').insert(post)
//     if (error) throw new Error(error.message)
//     return { error: null }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     const thisError = error?.message as string
//     return { error: thisError }
//   }
// }

// export const supa_update_facebook_posts = async (
//   post: I_supa_facebook_posts_update,
//   user_id: string
// ) => {
//   const user = await getCurrentUser()
//   const isadmin = isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
//   if (!isadmin) throw new Error('You are not authorized.')

//   const supabase = await createAdmin()

//   try {
//     const { error } = await supabase
//       .from('facebook_posts')
//       .update(post)
//       .eq('user_id', user_id)
//     if (error) throw new Error(error.message)
//     return { error: null }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     const thisError = error?.message as string
//     return { error: thisError }
//   }
// }

export const supa_delete_facebook_posts = async (recipient_id: string) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
  if (!isadmin) throw new Error('You are not authorized.')

  const supabase = await createAdmin()

  try {
    const { error } = await supabase
      .from('facebook_posts')
      .delete()
      .eq('user_id', recipient_id)
    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}

export const supa_select_facebook_posts = async (post_id: string) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
  if (!isadmin) throw new Error('You are not authorized.')

  const supabase = await createAdmin()

  try {
    const { data, error } = await supabase
      .from('facebook_posts')
      .select()
      .eq('post_id', post_id)
      .single()
    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
