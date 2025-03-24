'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { isAdmin } from '@/app/lib/adminCheck'
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
  if (error) {
    return error.message
  }
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })

  revalidatePath('/', 'layout')
  if (!clDisableRedirect) {
    redirect(
      clRedirectTo
        ? `/${clRedirectTo}`
        : isadmin
        ? '/admin'
        : `/dashboard/${data.user.id}`
    )
  }
}
