'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { isAdmin } from '@/app/lib/adminCheck'
import { redirect } from 'next/navigation'
import { supa_admin_reset_user_password } from '../admin/actions'

export const supa_update_password_action = async (
  password: string,
  user_id?: string
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (isadmin && user?.id && user_id) {
    const userId = user_id ?? user.id
    const { data, error } = await supa_admin_reset_user_password(
      password,
      userId
    )
    return { data, error: error ?? null }
  } else if (user) {
    const supabase = await createServer()
    const { data, error } = await supabase.auth.updateUser({
      password,
    })
    if (!error && !isadmin) {
      redirect(`/dashboard/${data.user?.id}`)
    } else if (!error && isadmin) {
      redirect('/admin')
    }
    return { data, error: error?.message ?? null }
  } else {
    return { error: 'Password reset failed.' }
  }
}
