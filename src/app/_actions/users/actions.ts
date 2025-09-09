'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { isAdmin } from '@/app/lib/adminCheck'
import { revalidatePath } from 'next/cache'

export const supa_select_all_fb_ad_ids = async () => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })

  if (!isadmin) return { data: null, error: 'Permission not allowed.' }
  const supabase = await createAdmin()
  try {
    const { data, error } = await supabase.from('users').select('fb_ad_IDs')

    const formatCurrentAdIDs = data as { fb_ad_IDs: string[] }[]

    const { fb_ad_IDs } = formatCurrentAdIDs?.reduce(
      (sum, b) => {
        return { fb_ad_IDs: [...sum.fb_ad_IDs, ...b.fb_ad_IDs] }
      },
      { fb_ad_IDs: [] }
    )

    if (error) throw new Error(error.message)
    return { data: fb_ad_IDs, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}

export const supa_update_users = async (data: I_supa_users_update) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })

  if (data.id) {
    const supabase = isadmin ? await createAdmin() : await createServer()
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', data.id)

    revalidatePath('/')
    return { error: error?.message ?? null }
  } else {
    return { error: 'Recipient ID is required' }
  }
}

interface I_supa_facebook_posts_with_comments
  extends I_supa_facebook_posts_row {
  facebook_comments: I_supa_facebook_comments_row[]
}

export interface I_supa_select_user_Response_Types extends I_supa_users_row {
  profile_pictures: I_supa_profile_pictures_row_unextended | null
  receipients_deleted_messages: I_supa_receipients_deleted_messages_row[]
  recipients: I_supa_recipients_row[] | null
  facebook_posts: I_supa_facebook_posts_with_comments[]
  facebook_insights: I_supa_facebook_insights_row[]
}

export const supa_select_user = async (
  user_id: string
): Promise<{
  data: I_supa_select_user_Response_Types | null
  error: string | null
}> => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  const supabase = isadmin ? await createAdmin() : await createServer()
  const { data, error } = await supabase
    .from('users')
    .select(
      '*, profile_pictures(*), receipients_deleted_messages(*), recipients(*), facebook_insights(*), facebook_posts(*, facebook_comments(*))'
    )
    .eq('id', user_id)
    .single()
  return { data, error: error?.message ?? null }
}

interface I_supa_select_users_all_paginated {
  mode: 'paginate'
  clLimit: number
  clCurrentPage: number
}
interface I_supa_select_users_all_search {
  mode: 'search'
  searchIDs: string[] | null
}

type I_supa_select_users_all_options =
  | I_supa_select_users_all_paginated
  | I_supa_select_users_all_search

export const supa_select_users_all = async (
  options: I_supa_select_users_all_options
): Promise<{
  data: I_supa_select_user_Response_Types[] | null
  error: string | null
}> => {
  const newLimit = options.mode === 'paginate' ? options.clLimit : 16
  const from =
    options.mode === 'paginate'
      ? options.clCurrentPage * newLimit - newLimit
      : 1
  const to =
    options.mode === 'paginate'
      ? options?.clCurrentPage * newLimit - newLimit + (newLimit - 1)
      : 2

  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  const supabase = isadmin ? await createAdmin() : await createServer()

  try {
    let query = supabase
      .from('users')
      .select(
        '*, profile_pictures(*), receipients_deleted_messages(*), recipients(*), facebook_insights(*), facebook_posts(*, facebook_comments(*))'
      )

    if (options.mode === 'search' && options.searchIDs) {
      query = query.in('id', options.searchIDs)
    }
    if (options.mode === 'paginate' && options.clLimit) {
      query = query.limit(newLimit).range(from, to)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
