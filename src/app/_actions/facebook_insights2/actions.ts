'use server'

import { createAdmin } from '@/app/config/supabase/supabaseAdmin'

export const supa_select_facebook_insights2 = async (user_id: string) => {
  const supabase = await createAdmin()
  try {
    const { data, error } = await supabase
      .from('facebook_insights2')
      .select()
      .eq('user_id', user_id)
      .single()
    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}

export const supa_insert_facebook_insights2 = async (
  rawData: I_supa_facebook_insights2_insert
) => {
  const supabase = await createAdmin()
  try {
    const { error } = await supabase.from('facebook_insights2').insert(rawData)
    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}

export const supa_update_facebook_insights2 = async (
  rawData: I_supa_facebook_insights2_update
) => {
  if (!rawData.post_id) return { error: 'Post ID is required.' }
  const supabase = await createAdmin()
  try {
    const { error } = await supabase
      .from('facebook_insights2')
      .update(rawData)
      .eq('post_id', rawData.post_id)
    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}

// export const supa_delete_facebook_insights2 = async (
//   post_id: string,
//   recipient_id: string
// ) => {
//   const supabase = await createAdmin()
//   try {
//     const { error } = await supabase
//       .from('facebook_insights2')
//       .delete()
//       .eq('post_id', post_id)
//       .eq('user_id', recipient_id)
//     console.log({ error })
//     if (error) throw new Error(error.message)
//     return { error: null }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     const thisError = error?.message as string
//     return { error: thisError }
//   }
// }
