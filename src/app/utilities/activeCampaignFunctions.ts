'use server'

import {
  ActiveCampaignListsResponse,
  ActiveCampaignTagsResponse,
  I_ac_add_to_list,
  I_ac_create_contact,
  I_Options,
} from '@/types/activeCampaign.types'

const headers: I_Options['headers'] = {
  accept: 'application/json',
  'content-type': 'application/json',
  'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY ?? '',
}

interface I_response {
  errors?: [{ title: string }]
  message?: string
}

const fetchACData = async <T>(
  urlStr: string,
  options: I_Options
): Promise<T> => {
  const response = await fetch(urlStr, options)
  return response.json()
}

export const ac_retrieveAllTags =
  async (): Promise<ActiveCampaignTagsResponse> => {
    const options: I_Options = { method: 'GET', headers }

    return await fetchACData(
      'https://lovetransfusion.api-us1.com/api/3/tags',
      options
    )
  }
export const ac_retrieveAllLists =
  async (): Promise<ActiveCampaignListsResponse> => {
    const options: I_Options = { method: 'GET', headers }

    return await fetchACData(
      'https://lovetransfusion.api-us1.com/api/3/lists',
      options
    )
  }

export const ac_create_contact = async (data: I_ac_create_contact) => {
  const options: I_Options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ contact: data }),
  }
  const response = (await fetchACData(
    'https://lovetransfusion.api-us1.com/api/3/contacts',
    options
  )) as I_response
  if (response.errors || response.message) {
    return response
  } else {
    // await ac_add_to_list({})
  }
}

export const ac_add_to_list = async (data: I_ac_add_to_list) => {
  const options: I_Options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ contact: data }),
  }
  try {
    return {
      data: await fetchACData(
        'https://lovetransfusion.api-us1.com/api/3/contacts',
        options
      ),
      error: null,
    }
  } catch (error) {
    return { data: null, error: error }
  }
}

export const ac_find_contact_using_email = async (contactEmailStr: string) => {
  const options = {
    method: 'GET',
    headers,
  }

  try {
    const lists = await fetchACData(
      `https://lovetransfusion.api-us1.com/api/3/contacts?email=${encodeURIComponent(
        contactEmailStr
      )}`,
      options
    )
    return { data: lists, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
