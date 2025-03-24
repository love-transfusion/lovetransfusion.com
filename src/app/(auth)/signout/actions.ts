'use server'
import { createServer } from '@/app/config/supabase/supabaseServer'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const supa_signout = async () => {
  const supabase = await createServer()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return error
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
