'use server'

import { supa_admin_upsert_list_of_recipients } from '../admin/actions'

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
 *  await fetchDataFromLTOrg_and_upsertto_users_data_website('string' | {
    fetch_date?: Date
    fetch_all?: boolean
    limit?: number
    searchIds?: string[]
})
 * ```
 * @returns
 * ```
 * {
 *    recipients[]
 * }
 * ```
 */
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

/**
 * @param recipientId 
 * ```
 *  await fetchDataFromLTOrg_and_upsertto_users_data_website('string' | {
    fetch_date?: Date
    fetch_all?: boolean
    limit?: number
    searchIds?: string[]
})
 * ```
 * @returns void
 */
export const fetchDataFromLTOrg_and_upsertto_users_data_website = async (
  recipientId: string
) => {
  const newOrgRecipientData: {
    recipients: I_supaorg_recipient_hugs_counters_comments[]
  } = await fetchDataFromLTOrg(recipientId)
  console.log({
    newOrgRecipientData,
    recipients: newOrgRecipientData.recipients,
    hugs: newOrgRecipientData.recipients[0].hugs.length,
  })

  await supa_admin_upsert_list_of_recipients([
    {
      id: recipientId, // recipient's id
      recipient: newOrgRecipientData.recipients[0], // recipient object
    },
  ])
}
