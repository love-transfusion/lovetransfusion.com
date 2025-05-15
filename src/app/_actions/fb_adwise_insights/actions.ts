'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'

export const supa_insert_fb_adwise_insights = async (
  rawData: I_supa_fb_adwise_insights_insert[]
) => {
  const supabase = await createServer()
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
