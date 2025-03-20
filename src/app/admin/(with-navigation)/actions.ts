'use server'

import { createAdmin } from '@/app/config/supabase/supabaseAdmin'

export const supa_admin_upsert_list_of_recipients = async (
  users_data: {
    recipient: I_supa_users_data_website_insert['recipient']
    id: I_supa_users_data_website_insert['id']
  }[]
) => {
  const supabase = await createAdmin()
  const { error } = await supabase.from('users_data_website').upsert(users_data)
  return error?.message
}
