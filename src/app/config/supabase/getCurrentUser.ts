'use server'

import { createServer } from './supabaseServer'

export const getCurrentUser = async () => {
  // { users_stripe_subscriptions: true }
  const supabase = await createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const getDefaultUserData = async () => {
      // Return default
      const { data, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
      return { data, error: userError?.message ?? null }
    }

    const { data } = await getDefaultUserData()

    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { role, ...newUser } = user
      return { ...data[0], ...newUser }
    }
  }
}
