'use server'

import { resend_signupConfirmation } from '@/app/(auth)/signup/resendActions'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { revalidatePath } from 'next/cache'
import { v4 as uuid } from 'uuid'

/** Global search:(STRING) of either firstname | parent_name | recipient id | email */
interface I_getDataFromLTOrg {
  /** Get data based on date */
  fetch_date?: Date
  fetch_all?: boolean
  limit?: number
}

interface I_userData {
  id: string
  recipient: I_supaorg_recipient
}

export const supa_admin_upsert_list_of_recipients = async (
  users_data: I_userData[]
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
    resend_signupConfirmation({ email, parent_name, password })
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
