'use server'

import { createServer } from './supabaseServer'


export const getCurrentUser = async (): Promise<I_User | null | undefined> => {
  // { users_stripe_subscriptions: true }
  const supabase = await createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null
  const getDefaultUserData = async () => {
    // Return default
    const { data, error: userError } = await supabase
      .from('users')
      .select('*, users_data_website(*)')
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
