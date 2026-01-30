'use server'

import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '@/app/lib/adminCheck'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { createServer } from '@/app/config/supabase/supabaseServer'

export const supa_upsert_recipients = async (
  recipients: I_supa_recipients_insert[],
  CRON?: string | null,
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (CRON !== `Bearer ${process.env.CRON_SECRET}` && !isadmin)
    return { data: null, count: 0, error: 'You are not authorized.' }

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
    | undefined,
  CRON?: string | null,
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  if (CRON !== `Bearer ${process.env.CRON_SECRET}` && !isadmin)
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
      .eq('is_deleted', false)
      .eq('in_memoriam', false)

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

interface InMemoriamTypes {
  in_memoriam: boolean
  recipient_id?: never
}
interface RecipientIdTypes {
  recipient_id: string
  in_memoriam?: never
}

type Supa_select_recipientsTypes = InMemoriamTypes | RecipientIdTypes

export const supa_select_recipients = async (
  props: Supa_select_recipientsTypes,
  CRON?: string | null,
) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })

  if (!isadmin && CRON !== `Bearer ${process.env.CRON_SECRET}`)
    return { data: null, error: 'You are not authorized.' }

  const supabase = await createAdmin()

  try {
    let newData
    let newError
    if (props.in_memoriam) {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('in_memoriam', props.in_memoriam)
      newData = data
      newError = error
    } else if (props.recipient_id) {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('id', props.recipient_id)
        .single()
      newData = data
      newError = error
    }

    if (newError) throw new Error(newError.message)

    return { data: newData, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}

export const supa_update_recipients = async (
  recipientObj: I_supa_recipients_update,
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

export const supa_delete_recipient = async (props: {
  recipient_id: string
  CRON?: string | null
}) => {
  const { CRON, recipient_id } = props

  if (!CRON || CRON !== `Bearer ${process.env.CRON_SECRET}`) return
  const supabase = await createAdmin()

  try {
    const { data, error } = await supabase
      .from('recipients')
      .delete()
      .eq('id', recipient_id)
      .select()
      
    if (error) throw new Error(error.message)

    return { error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { error: thisError }
  }
}
