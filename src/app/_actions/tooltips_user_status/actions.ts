'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { isAdmin } from '@/app/lib/adminCheck'

export const supa_upsert_tooltips_user_status = async (
  rawData:
    | I_supa_tooltips_user_status_insert[]
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (isadmin)
    return {
      data: null,
      error:
        'You cannot add row in tooltips_user_data because you are an administrator.',
    }
  const supabase = await createServer()
  try {
    const { data, error } = await supabase
      .from('tooltips_user_status')
      .upsert(rawData, { onConflict: 'id' })
      .select('*')
    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
