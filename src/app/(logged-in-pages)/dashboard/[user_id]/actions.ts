'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'

export interface I_userData {
  id: string
  recipient: I_supaorg_recipient
}

export const supa_select_recipient = async (user_id: string) => {
  const supabase = await createServer()
  const { data, error } = await supabase
    .from('users_data_website')
    .select('*')
    .eq('user_id', user_id)
    .single()
  return { data, error: error?.message ?? null }
}

// export const supa_select_comments = async (user_id: string) => {
//   const supabase = await createServer()
//   const { data, error } = await supabase
//     .from('users_data_website')
//     .select('*')
//     .eq('user_id', user_id)
//     .single()
//   return { data, error: error?.message ?? null }
// }
