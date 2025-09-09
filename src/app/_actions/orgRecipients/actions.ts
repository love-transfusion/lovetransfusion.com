'use server'

import { extended_supaorg_recipient } from "@/types/global"

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
