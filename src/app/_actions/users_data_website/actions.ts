'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'
import { PostgrestError } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

interface I_custom_selected_recipient
  extends Omit<I_supa_unextended_users_data_website_row, 'recipient'> {
  recipient: I_supaorg_recipient_hugs_counters_comments
  receipients_deleted_messages: I_supa_receipients_deleted_messages_row[]
}
interface I_selected_recipient {
  data: I_custom_selected_recipient | null
  error: PostgrestError | null
}

export interface I_selected_recipient_response {
  data: I_custom_selected_recipient | null
  error: string | null
}

// export const supa_select_recipient = async (
//   user_id: string
// ): Promise<I_selected_recipient_response> => {
//   const supabase = await createServer()
//   const { data, error }: I_selected_recipient = await supabase
//     .from('users_data_website')
//     .select('*, receipients_deleted_messages(*)')
//     .eq('user_id', user_id)
//     .single()
//   return { data, error: error?.message ?? null }
// }

export const supa_select_users_data_website = async (options: {
  clLimit?: number
  clCurrentPage: number
}): Promise<{
  data: I_supa_users_data_website_row[] | []
  count: number
  error: string | null
}> => {
  const { clLimit, clCurrentPage } = options
  const supabase = await createServer()
  const newLimit = clLimit ?? 16
  const from = clCurrentPage * newLimit - newLimit
  const to = clCurrentPage * newLimit - newLimit + (newLimit - 1)

  try {
    const { data, error, count } = await supabase
      .from('users_data_website')
      .select('*', { count: 'estimated' })
      .order('created_at', { ascending: false })
      .limit(clLimit ?? 50)
      .limit(newLimit)
      .range(from, to)

    if (error) throw new Error(error.message)
    return { data: data ?? [], count: count ?? 0, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: [], count: 0, error: thisError }
  }
}

export const supa_delete_users_data_website = async (user_id: string) => {
  const supabase = await createServer()
  try {
    const { error }: I_selected_recipient = await supabase
      .from('users_data_website')
      .delete()
      .eq('id', user_id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}
