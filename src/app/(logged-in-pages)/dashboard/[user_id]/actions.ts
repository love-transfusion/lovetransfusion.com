'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'

export interface I_Recipient_Data {
  id: string
  recipient: I_supaOrg_recipients_row
}

export const supa_insert_deleted_messages = async (
  data: I_supa_receipients_deleted_messages_insert
) => {
  const supabase = await createServer()
  const { data: result, error } = await supabase
    .from('receipients_deleted_messages')
    .insert(data)
    .select()

  return { data: result, error: error?.message ?? null }
}

export const filter_comments = async (
  comments: I_supaorg_comments[],
  clDeletedMessages: I_supa_receipients_deleted_messages_row[]
) => {
  return comments.filter((comment) => {
    return !clDeletedMessages.some((dlMessages) => {
      return dlMessages.id === comment.id
    })
  })
}
