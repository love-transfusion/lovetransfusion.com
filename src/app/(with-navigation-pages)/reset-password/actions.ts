'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { redirect } from 'next/navigation'

export const supa_update_password_action = async (password: string) => {
  const user = await getCurrentUser()
  if (user) {
    const supabase = await createServer()
    const { data, error } = await supabase.auth.updateUser({
      password,
    })
    if (!error) {
      redirect(`/dashboard/${data.user?.id}`)
    }
    return { data, error: error?.message ?? null }
  } else {
    return { error: 'Password reset failed.' }
  }
}
