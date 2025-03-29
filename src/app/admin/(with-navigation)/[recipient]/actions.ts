'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { isAdmin } from '@/app/lib/adminCheck'
import { formatDateToUTCString } from '@/app/utilities/date-and-time/formatDateToUTCString'

export const supa_admin_update_recipient_website = async (
  recipient: I_supa_users_data_website_update & { id: UUID }
) => {
  // const { id, ...recipientObj } = recipient
  const supabase = await createAdmin()
  const { data, error } = await supabase
    .from('users_data_website')
    .update(recipient)
    .eq('id', recipient.id)
    .select()
  return { data, error: error?.message ?? null }
}

export const supa_admin_select_recipient_data = async (uuid: UUID) => {
  const user = await getCurrentUser()
  isAdmin({ clRole: user?.role }) // This will redirect user to a not found page if he/she is not an admin
  const supabase = await createAdmin()

  const { data, error } = await supabase
    .from('users_data_website')
    .select('*')
    .eq('id', uuid)
    .single()
  return { data, error: error?.message ?? null }
}

export const supa_admin_select_paginated_recipients = async (optionsObject?: {
  clFetchDateFrom?: Date
  clLimit?: number
}) => {
  const { clFetchDateFrom, clLimit } = optionsObject ?? {}
  const supabase = await createAdmin()
  const { data, error } = await supabase
    .from('users_data_website')
    .select('*')
    .lt('created_at', clFetchDateFrom ?? formatDateToUTCString(new Date()))
    .limit(clLimit ?? 20)

  return { data: data ?? [], error: error?.message ?? null }
}
