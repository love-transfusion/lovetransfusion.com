'use server'

import { extended_supaorg_recipient } from '@/types/global'
import axios from 'axios'

/** Global search:(STRING) of either firstname | parent_name | recipient id | email */
interface I_getDataFromLTOrg {
  /** Get data based on date */
  fetch_date?: Date
  fetch_all?: boolean
  limit?: number
  searchIds?: string[]
}

/**
 * @param body
 * ```
 * {
 *    recipients[]
 * }
 */

export type I_supaorg_recipient = extended_supaorg_recipient & {
  hugs: I_supaorg_hug[]
  recipient_counters: I_supaOrg_recipient_counters_row | null
  comments: I_supaorg_comments[]
  recipients_profile_pictures: I_supaOrg_recipients_profile_pictures_row
}

export const supa_select_org_recipients = async (
  body: I_getDataFromLTOrg | string
): Promise<{ recipients: I_supaorg_recipient_hugs_counters_comments[] }> => {
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

export const supa_select_orgRecipients = async (
  search?: string
): Promise<{
  data: I_supaorg_recipient[] | null
  error: string | null
}> => {
  try {
    const {
      data: { data, error },
    } = await axios.post(
      'https://lovetransfusion-org-ts.vercel.app/api/recipients',
      { search },
      {
        headers: {
          'Content-Type': 'application/json',
          'secret-key': process.env.LT_ORG_ROUTE_SECRET_KEY!,
        },
      }
    )
    if (error) throw new Error(error.message)
    const newData = data as I_supaorg_recipient[]
    return { data: newData, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}
