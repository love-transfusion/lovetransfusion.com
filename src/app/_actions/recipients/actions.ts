'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '@/app/lib/adminCheck'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { createServer } from '@/app/config/supabase/supabaseServer'

export const supa_upsert_recipients = async (
  recipients: I_supa_recipients_insert[]
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (!isadmin) return { data: null, error: 'You are not authorized.' }
  const supabase = await createAdmin()

  try {
    const { error } = await supabase
      .from('recipients')
      .upsert(recipients, { onConflict: 'id' })
    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}

export const supa_select_recipients_all = async (
  options?:
    | {
        clLimit: number
        clCurrentPage: number
      }
    | undefined
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (!isadmin)
    return { data: null, count: 0, error: 'You are not authorized.' }
  const supabase = await createAdmin()

  const newLimit = options?.clLimit ?? 16
  const from = options?.clCurrentPage
    ? options.clCurrentPage * newLimit - newLimit
    : 0
  const to =
    options?.clCurrentPage &&
    options.clCurrentPage * newLimit - newLimit + (newLimit - 1)

  try {
    let query = supabase
      .from('recipients')
      .select('*', { count: 'estimated' })
      .order('created_at', { ascending: false })

    if (to) {
      query = query.limit(newLimit).range(from, to)
    }

    const { data, error, count } = await query
    if (error) throw new Error(error.message)
    return { data, count: count ?? 0, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, count: 0, error: thisError }
  }
}

export const supa_select_recipients = async (recipientID: string) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (!isadmin) return { data: null, error: 'You are not authorized.' }
  const supabase = isadmin ? await createAdmin() : await createServer()

  try {
    const { data, error } = await supabase
      .from('recipients')
      .select('*')
      .eq('id', recipientID)
      .single()

    if (error) throw new Error(error.message)
    return { data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}

export const supa_update_recipients = async (
  recipientObj: I_supa_recipients_update
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (!isadmin) return { error: 'You are not authorized.' }
  if (!recipientObj.id) return { error: `Recipient's ID is required.` }
  const supabase = isadmin ? await createAdmin() : await createServer()

  try {
    const { error } = await supabase
      .from('recipients')
      .update(recipientObj)
      .eq('id', recipientObj.id)

    if (error) throw new Error(error.message)
    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}
