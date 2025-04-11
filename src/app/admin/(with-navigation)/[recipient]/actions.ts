'use server'

import { createAdmin } from '@/app/config/supabase/supabaseAdmin'

export const supa_admin_update_recipient_website = async (
  recipient: I_supa_users_data_website_update & { id: UUID }
) => {
  const supabase = await createAdmin()
  const { data, error } = await supabase
    .from('users_data_website')
    .update(recipient)
    .eq('id', recipient.id)
    .select()
  return { data, error: error?.message ?? null }
}
