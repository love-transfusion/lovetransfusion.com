'use server'
import { I_Recipient_Data } from '@/app/(logged-in-pages)/dashboard/[user_id]/actions'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { resendEmail_AccountCredentials } from '@/app/lib/resend_email_templates/resendEmail_AccountCredentials'
import { revalidatePath } from 'next/cache'
import { v4 as uuid } from 'uuid'

export const supa_admin_search_recipient = async (clSearchKeyword: string) => {
  const supabase = await createAdmin()
  const { data, error } = await supabase
    .from('users_data_website')
    .select()
    .or(
      `recipient->>first_name.ilike.${
        clSearchKeyword ?? ''
      },recipient->>id.eq.${
        clSearchKeyword ?? ''
      },recipient->>parent_name.ilike.${
        clSearchKeyword ?? ''
      },recipient->>email.ilike.${clSearchKeyword ?? ''}`
    )
  return { data, error: error?.message ?? null }
}

interface I_signupData {
  id: string
  parent_name: string
  email: string
  recipient_name: string
  recipient_id: string
}

export const supa_admin_create_account = async (rawData: I_signupData) => {
  const {
    id,
    email,
    parent_name,
    recipient_name,
    recipient_id: stringRecipientId,
  } = rawData
  const supabase = await createAdmin()
  const password = uuid().slice(0, 6)
  const recipient_id = stringRecipientId as UUID
  const { data, error } = await supabase.auth.admin.createUser({
    id,
    email,
    password,
    email_confirm: true,
    user_metadata: { parent_name, recipient_name, recipient_id },
  })
  if (!error) {
    resendEmail_AccountCredentials({ email, password, parent_name })
  }
  revalidatePath('/admin')
  return { data, error: error?.message ?? null }
}

export const supa_admin_select_recipient_data = async (uuid: UUID) => {
  const supabase = await createAdmin()

  const { data, error } = await supabase
    .from('users_data_website')
    .select('*')
    .eq('id', uuid)
    .single()
  return { data, error: error?.message ?? null }
}

export const supa_admin_delete_auth_user = async (user_id: string) => {
  const supabase = await createAdmin()
  const { data, error } = await supabase.auth.admin.deleteUser(user_id)
  revalidatePath('/admin')
  return { data, error: error?.message ?? null }
}

/**
 * 
 * users_data: I_Recipient_Data[]
 * @example
 * ```
 *  await supa_admin_upsert_list_of_recipients({
      id: string, // recipient's id
      recipient: I_supaOrg_recipients_row // recipient object
    })
 * ```
 * @returns 
 */
export const supa_admin_upsert_list_of_recipients = async (
  users_data: I_Recipient_Data[]
) => {
  const supabase = await createAdmin()
  const { error } = await supabase.from('users_data_website').upsert(users_data)

  revalidatePath('/admin')
  return error?.message
}

export const supa_admin_search_multiple_users = async (
  IDs: string[]
): Promise<{
  data: I_supa_users_row[] | []
  error: string | null
}> => {
  const supabase = await createAdmin()
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('id', IDs)
    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: [], error: thisError }
  }
}

export const supa_admin_reset_user_password = async (
  newPassword: string,
  userId: string
) => {
  const supabase = await createAdmin()

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  })
  return { data, error: error?.message ?? null }
}
