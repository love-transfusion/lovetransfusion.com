'use server'
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
