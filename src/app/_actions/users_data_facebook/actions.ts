'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { isAdmin } from '@/app/lib/adminCheck'

export const supa_upsert_users_data_facebook = async (
  rawData: I_supa_users_data_facebook_insert
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (!rawData.id) return
  const supabase = isadmin ? await createAdmin() : await createServer()
  try {
    const { error } = await supabase.from('users_data_facebook').upsert(rawData)
    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}
