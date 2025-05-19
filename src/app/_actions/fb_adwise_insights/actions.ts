'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { isAdmin } from '@/app/lib/adminCheck'

export const supa_insert_fb_adwise_insights = async (
  rawData: I_supa_fb_adwise_insights_insert[]
) => {
  const user = await getCurrentUser()
  isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
  const supabase = await createAdmin()
  try {
    const { data, error } = await supabase
      .from('fb_adwise_insights')
      .upsert(rawData, { onConflict: 'ad_id,cl_region,cl_country_code' })
      .select()
    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
