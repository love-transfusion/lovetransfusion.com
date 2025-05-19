'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'
import { util_formatDateToUTCString } from '@/app/utilities/date-and-time/util_formatDateToUTCString'
import { PostgrestError } from '@supabase/supabase-js'

interface I_custom_selected_recipient
  extends Omit<I_supa_unextended_users_data_website_row, 'recipient'> {
  recipient: I_supaorg_recipient_hugs_counters_comments
  receipients_deleted_messages: I_supa_receipients_deleted_messages_row[]
}
interface I_selected_recipient {
  data: I_custom_selected_recipient | null
  error: PostgrestError | null
}

export interface I_selected_recipient_response {
  data: I_custom_selected_recipient | null
  error: string | null
}

export const supa_select_recipient = async (
  user_id: string
): Promise<I_selected_recipient_response> => {
  console.time('supa_select_recipient')
  const supabase = await createServer()
  const { data, error }: I_selected_recipient = await supabase
    .from('users_data_website')
    .select('*, receipients_deleted_messages(*)')
    .eq('user_id', user_id)
    .single()
    console.timeEnd('supa_select_recipient')
  return { data, error: error?.message ?? null }
}

export const supa_select_paginated_recipients = async (optionsObject?: {
  clFetchDateFrom?: Date
  clLimit?: number
}) => {
  const { clFetchDateFrom, clLimit } = optionsObject ?? {}
  const supabase = await createServer()
  const { data, error } = await supabase
    .from('users_data_website')
    .select('*')
    .lt('created_at', clFetchDateFrom ?? util_formatDateToUTCString(new Date()))
    .limit(clLimit ?? 20)

  return { data: data ?? [], error: error?.message ?? null }
}
