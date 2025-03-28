'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'
import { revalidatePath } from 'next/cache'

export interface I_userData {
  id: string
  recipient: I_supaorg_recipient
}

export const supa_update_recipient_data_from_org = async (data: I_userData) => {
  const supabase = await createServer()
  const { data: result, error } = await supabase
    .from('users_data_website')
    .update(data)
    .eq('user_id', data.id)
    .select()
    .single()
  revalidatePath('/')
  return { data: result, error: error?.message ?? null }
}
