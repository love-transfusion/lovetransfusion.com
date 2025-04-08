'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { isAdmin } from '@/app/lib/adminCheck'

export const supa_update_users = async (data: I_supa_users_insert) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  const supabase = isadmin ? await createAdmin() : await createServer()
  const { error } = await supabase.from('users').update(data).eq('id', data.id)
  return { error: error?.message ?? null }
}

export const supa_select_user = async (user_id: string) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  const supabase = isadmin ? await createAdmin() : await createServer()
  const { data, error } = await supabase
    .from('users')
    .select('*, profile_pictures(*), users_data_website(*)')
    .eq('id', user_id)
    .single()
  return { data, error: error?.message ?? null }
}
