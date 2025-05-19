'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { isAdmin } from '@/app/lib/adminCheck'
import { revalidatePath } from 'next/cache'

export const supa_update_users = async (data: I_supa_users_update) => {
  console.time('supa_update_users')
  const user = await getCurrentUser()
  console.timeEnd('supa_update_users')
  const isadmin = isAdmin({ clRole: user?.role })
  if (data.id) {
    const supabase = isadmin ? await createAdmin() : await createServer()
    console.time('fetch user')
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', data.id)
    console.timeEnd('fetch user')
    revalidatePath('/')
    console.timeEnd('supa_update_users')
    return { error: error?.message ?? null }
  } else {
    console.timeEnd('supa_update_users')
    return { error: 'Recipient ID is required' }
  }
}

export const supa_select_user = async (user_id: string) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  const supabase = isadmin ? await createAdmin() : await createServer()
  console.time('fetch user')
  const { data, error } = await supabase
    .from('users')
    .select('*, profile_pictures(*), users_data_website(*)')
    .eq('id', user_id)
    .single()
  console.timeEnd('fetch user')
  return { data, error: error?.message ?? null }
}
