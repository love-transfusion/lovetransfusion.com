'use server'

import { resendEmail_AccountCredentials } from '@/app/lib/resend_email_templates/resendEmail_AccountCredentials'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { revalidatePath } from 'next/cache'
import { v4 as uuid } from 'uuid'
import { I_Recipient_Data } from '@/app/(logged-in-pages)/dashboard/[user_id]/actions'

/** Global search:(STRING) of either firstname | parent_name | recipient id | email */
interface I_getDataFromLTOrg {
  /** Get data based on date */
  fetch_date?: Date
  fetch_all?: boolean
  limit?: number
}

export const supa_admin_upsert_list_of_recipients = async (
  users_data: I_Recipient_Data[]
) => {
  const supabase = await createAdmin()
  const { error } = await supabase.from('users_data_website').upsert(users_data)

  revalidatePath('/admin')
  return error?.message
}

interface I_signupData {
  parent_name: string
  email: string
}
export const supa_admin_create_account = async (rawData: I_signupData) => {
  const { email, parent_name } = rawData
  const supabase = await createAdmin()
  const password = uuid().slice(0, 6)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { parent_name },
  })
  if (!error) {
    resendEmail_AccountCredentials({ email, password, parent_name })
  }
  revalidatePath('/admin')
  return { data, error: error?.message ?? null }
}

export const fetchDataFromLTOrg = async (body: I_getDataFromLTOrg | string) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(body),
  }
  return await fetch(
    'https://www.lovetransfusion.org/api/recipients2',
    requestOptions
  )
    .then((response) => response.json()) // Convert response to JSON
    .then((data) => data) // Log the response
    .catch((error) => console.error('Error:', error))
}
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
      },recipient->>parent_name.ilike.Doe,recipient->>email.ilike.${
        clSearchKeyword ?? ''
      }`
    )
  return { data, error: error?.message ?? null }
}
