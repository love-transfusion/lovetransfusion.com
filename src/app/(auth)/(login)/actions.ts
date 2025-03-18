'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'
import { I_Auth_LoginRequiredData } from '@/types/auth.types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface I_supa_signin {
  clRedirectTo?: string
  clDisableRedirect?: boolean
  clRawData: I_Auth_LoginRequiredData
}

export async function supa_signin({
  clRawData,
  clRedirectTo,
  clDisableRedirect,
}: I_supa_signin): Promise<string | undefined> {
  const { email, password } = clRawData
  const supabase = await createServer()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log('data', data)
  if (error) {
    return error.message
  }
  revalidatePath('/', 'layout')
  if (!clDisableRedirect) {
    redirect(clRedirectTo ? `/${clRedirectTo}` : '/dashboard')
  }
}
