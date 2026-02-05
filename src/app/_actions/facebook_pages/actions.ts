'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { isAdmin } from '@/app/lib/adminCheck'

export const supa_update_facebook_pages = async (props: {
  clFacebookPageID: string
  clFbPageObj: I_supa_facebook_pages_update
  clCRON?: string | null
}) => {
  const { clFbPageObj, clCRON, clFacebookPageID } = props
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (!isadmin && clCRON !== `Bearer ${process.env.CRON_SECRET}`)
    return { data: null, error: 'Access denied.' }

  const supabase = await createAdmin()

  try {
    const { error } = await supabase
      .from('facebook_pages')
      .update(clFbPageObj)
      .eq('page_id', clFacebookPageID)
    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}

export const supa_select_facebook_pages_pageToken = async (props: {
  clFacebookPageID: string
  clCRON?: string | null
}) => {
  const { clCRON, clFacebookPageID } = props
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (!isadmin && clCRON !== `Bearer ${process.env.CRON_SECRET}`)
    return { data: null, error: 'Access denied.' }

  const supabase = await createAdmin()
  try {
    const { data, error } = await supabase
      .from('facebook_pages')
      .select('page_token')
      .eq('page_id', clFacebookPageID)
      .single()
    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
