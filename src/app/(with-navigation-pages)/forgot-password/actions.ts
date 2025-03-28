'use server'

import { createAdmin } from '@/app/config/supabase/supabaseAdmin'

interface I_supa_reset_password_for_email {
  email: string
}

export const supa_reset_password_for_email = async (
  data: I_supa_reset_password_for_email
) => {
  const { email } = data
  const supabase = await createAdmin()

  const { data: user } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single()
  if (!user) {
    return 'Your email does not exist.'
  } else if (user.email) {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/confirm/auth`,
    })
    return error?.message
  }
}
