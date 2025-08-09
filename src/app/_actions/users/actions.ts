'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { isAdmin } from '@/app/lib/adminCheck'
import { revalidatePath } from 'next/cache'

export const supa_select_all_fb_ad_ids = async () => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })

  if (!isadmin) return { data: null, error: 'Permission not allowed.' }
  const supabase = await createAdmin()
  try {
    const { data, error } = await supabase.from('users').select('fb_ad_IDs')

    const formatCurrentAdIDs = data as { fb_ad_IDs: string[] }[]

    const { fb_ad_IDs } = formatCurrentAdIDs?.reduce(
      (sum, b) => {
        return { fb_ad_IDs: [...sum.fb_ad_IDs, ...b.fb_ad_IDs] }
      },
      { fb_ad_IDs: [] }
    )

    if (error) throw new Error(error.message)
    return { data: fb_ad_IDs, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}

export const supa_update_users = async (data: I_supa_users_update) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })

  if (data.id) {
    const supabase = isadmin ? await createAdmin() : await createServer()
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', data.id)

    revalidatePath('/')
    return { error: error?.message ?? null }
  } else {
    return { error: 'Recipient ID is required' }
  }
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
