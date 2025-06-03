'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'

export const supa_select_tooltips = async (path: `/${string}`) => {
  const supabase = await createServer()
  try {
    const { data, error } = await supabase
      .from('tooltips')
      .select('*, tooltips_user_status(*)')
      .eq('page', path)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
