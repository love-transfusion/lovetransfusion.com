/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import {
  I_ac_ContactList_Request,
  I_ac_ContactList_Response,
} from '@/types/ActiveCampaign/contact/contactList.types'
import { I_ac_Contact_Search_Response } from '@/types/ActiveCampaign/contact/contactSearch.types'
import {
  I_ac_CreateContactRequest,
  I_ac_CreateContactResponse,
} from '@/types/ActiveCampaign/contact/createContact.types'
import { I_ac_FieldsResponse } from '@/types/ActiveCampaign/custom-fields/customFields.types'
import { I_ac_ListsResponse } from '@/types/ActiveCampaign/list/list.types'
import { I_Options } from '@/types/ActiveCampaign/options.types'
import {
  I_ac_add_tag_toContact_Response,
  I_ac_add_TagRequest,
} from '@/types/ActiveCampaign/Tag/addTagToContact.types'
import { ac_contactTag_Response } from '@/types/ActiveCampaign/Tag/contactTags.types'
import { I_ac_list_all_TagsResponse } from '@/types/ActiveCampaign/Tag/listAllTags.types'
import { I_ac_remove_tag_of_contact } from '@/types/ActiveCampaign/Tag/removeTagToContact.types'
import {
  ac_list_types,
  ac_lists,
} from '../lib/(activecampaign)/library/ac_lists'
import { ac_tag_types, ac_tags } from '../lib/(activecampaign)/library/ac_tags'
import {
  ac_ActiveCampaignContactResponse,
  I_ac_ActiveCampaignContactPayload,
} from '@/types/ActiveCampaign/contact/updateContact.types'

const headers: I_Options['headers'] = {
  accept: 'application/json',
  'content-type': 'application/json',
  'Api-Token': process.env.ACTIVE_CAMPAIGN_API_KEY ?? '',
}

const fetchACData = async <T>(
  urlStr: string,
  options: I_Options
): Promise<T> => {
  const response = await fetch(urlStr, options)
  return response.json()
}

export const ac_retrieveAllTags = async () => {
  const options: I_Options = { method: 'GET', headers }

  try {
    const dataResult: I_ac_list_all_TagsResponse = await fetchACData(
      'https://lovetransfusion.api-us1.com/api/3/tags',
      options
    )
    return { data: dataResult, error: null }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}
export const ac_retrieveAllLists = async () => {
  const options: I_Options = { method: 'GET', headers }

  try {
    const dataResult: I_ac_ListsResponse = await fetchACData(
      'https://lovetransfusion.api-us1.com/api/3/lists',
      options
    )
    return { data: dataResult, error: null }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}
export const ac_retrieveAllFields = async (clLimit?: number) => {
  const options: I_Options = { method: 'GET', headers }

  try {
    const dataResult: I_ac_FieldsResponse = await fetchACData(
      `https://lovetransfusion.api-us1.com/api/3/fields${
        clLimit ? `?limit=${clLimit}` : ''
      }`,
      options
    )
    return { data: dataResult, error: null }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}

export const ac_create_contact = async (data: I_ac_CreateContactRequest) => {
  const options: I_Options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ contact: data }),
  }
  try {
    // Guide: https://developers.activecampaign.com/reference/create-a-new-contact
    const response: I_ac_CreateContactResponse = await fetchACData(
      'https://lovetransfusion.api-us1.com/api/3/contacts',
      options
    )
    if (response.message) {
      throw new Error(response.message)
    } else if (response.errors) {
      throw new Error(response.errors.title)
    } else {
      return { data: response.contact, error: null }
    }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}

/**
 * @example
 * ```
 * {clID: number, clContact: {
      email?: string
      firstName?: string
      lastName?: string
      fieldValues?: ActiveCampaignFieldValue[]
 }}
 * ```
 */
export const ac_update_contact = async ({
  clID,
  clContact,
}: I_ac_ActiveCampaignContactPayload): Promise<{
  data: ac_ActiveCampaignContactResponse | null
  error: string | null
}> => {
  const options: I_Options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ contact: clContact }),
  }
  try {
    const response: ac_ActiveCampaignContactResponse = await fetchACData(
      `https://lovetransfusion.api-us1.com/api/3/contacts/${clID}`,
      options
    )
    if (response.message) {
      throw new Error(response.message)
    } else if (response.errors) {
      throw new Error(response.errors[0].detail)
    } else {
      return { data: response, error: null }
    }
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: null, error: thisError }
  }
}

export const ac_addOrRemove_list_from_contact = async (
  data: I_ac_ContactList_Request
) => {
  const status = data.status ?? '1'
  const options: I_Options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ contactList: { ...data, status } }),
  }
  try {
    // Guide: https://developers.activecampaign.com/reference/update-list-status-for-contact
    const response: I_ac_ContactList_Response = await fetchACData(
      'https://lovetransfusion.api-us1.com/api/3/contactLists',
      options
    )

    if (response.contacts && response.contacts.length > 0) {
      return { data: response.contacts[0], error: null }
    } else {
      throw new Error('List not found on the selected contact.')
    }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}

export const ac_find_contact_using_email = async (contactEmailStr: string) => {
  const options = {
    method: 'GET',
    headers,
  }

  try {
    // Guide: https://developers.activecampaign.com/reference/list-all-contacts
    const response: I_ac_Contact_Search_Response = await fetchACData(
      `https://lovetransfusion.api-us1.com/api/3/contacts?email=${encodeURIComponent(
        contactEmailStr
      )}`,
      options
    )
    if (response.contacts.length > 0) {
      return { data: response.contacts[0], error: null }
    } else {
      throw new Error('Contact not found')
    }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}

/**
 * @example
 * ```
 * {
    contact: `${number}`
    tag: `${number}`
   }
  ```
 */
export const ac_add_tag_to_contact = async (data: I_ac_add_TagRequest) => {
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ contactTag: data }),
  }

  try {
    // Guide: https://developers.activecampaign.com/reference/create-contact-tag
    const response: I_ac_add_tag_toContact_Response = await fetchACData(
      `https://lovetransfusion.api-us1.com/api/3/contactTags`,
      options
    )
    if (response.errors) {
      throw new Error(response.errors.title)
    } else {
      return { data: response.contactTag, error: null }
    }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}

export const ac_retrieve_contactTags = async (contactId: number) => {
  const options = {
    method: 'GET',
    headers,
  }

  try {
    const retrievedTagsOfContact: ac_contactTag_Response = await fetchACData(
      `https://lovetransfusion.api-us1.com/api/3/contacts/${contactId}/contactTags`,
      options
    )
    if (retrievedTagsOfContact.message) {
      throw new Error(retrievedTagsOfContact.message)
    } else {
      return { data: retrievedTagsOfContact.contactTags, error: null }
    }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}

export const ac_remove_tag_to_contact = async ({
  id,
  contactId,
}: {
  id: number
  contactId: number
}) => {
  const options = {
    method: 'DELETE',
    headers,
  }

  try {
    const retrievedTagsOfContact = await ac_retrieve_contactTags(contactId)
    const foundTag = retrievedTagsOfContact.data?.find(
      (item) => item.tag === `${id}`
    )

    if (!foundTag) throw new Error('Tag not found.')

    // Guide: https://developers.activecampaign.com/reference/remove-a-contacts-tag
    const response: I_ac_remove_tag_of_contact = await fetchACData(
      `https://lovetransfusion.api-us1.com/api/3/contactTags/${foundTag?.id}`,
      options
    )

    if (response.message) {
      throw new Error(response.message)
    } else {
      return { data: 'Successfully removed a tag', error: null }
    }
  } catch (error: any) {
    const theError = error?.message as string
    return { data: null, error: theError }
  }
}
//  **************** Customized ****************
export const ac_custom_create_contact = async ({
  data,
  clListName,
  clTagname,
  clTagRemove,
}: {
  data: I_ac_CreateContactRequest
  clListName?: ac_list_types
  clTagname?: ac_tag_types
  clTagRemove?: ac_tag_types
}) => {
  try {
    if (!data.email.trim()) throw new Error('Email is required')

    const { data: response, error: responseError } = await ac_create_contact(
      data
    )
    if (responseError) throw new Error(responseError)

    if (response) {
      if (clListName) {
        const { error: listError } = await ac_addOrRemove_list_from_contact({
          contact: response?.id,
          list: ac_lists.getList(clListName).id,
        })
        if (listError) throw new Error(listError)
      }
      if (clTagname) {
        const { error: tagError } = await ac_add_tag_to_contact({
          contact: response.id,
          tag: ac_tags.getTag(clTagname).id,
        })
        if (tagError) throw new Error(tagError)
      }
      if (clTagRemove) {
        const { error: removeTagError } = await ac_remove_tag_to_contact({
          id: parseInt(ac_tags.getTag('test').id),
          contactId: parseInt(response.id),
        })
        if (removeTagError) throw new Error(removeTagError)
      }
      return { error: null }
    } else {
      throw new Error('Unknown error')
    }
  } catch (error: any) {
    const theError = error?.message as string
    return { error: theError }
  }
}

export const ac_custom_removeProperty_from_contact = async ({
  email,
  clTagRemove,
  clListRemove,
}: {
  email: string
  clTagRemove?: ac_tag_types
  clListRemove?: ac_list_types
}) => {
  try {
    if (!email.trim()) throw new Error('Email is required.')
    const { data: response, error: responseError } =
      await ac_find_contact_using_email(email)
    if (responseError) throw new Error(responseError)

    if (response) {
      let error
      if (clTagRemove) {
        const { error: tagError } = await ac_remove_tag_to_contact({
          contactId: parseInt(response.id),
          id: parseInt(ac_tags.getTag(clTagRemove).id),
        })
        error = tagError
      }
      if (clListRemove) {
        const { error: listError } = await ac_addOrRemove_list_from_contact({
          contact: response.id,
          list: ac_lists.getList(clListRemove).id,
          status: '2',
        })
        error = listError
      }
      if (error) throw new Error(error)
      return { error: null }
    } else {
      throw new Error('Unknown error')
    }
  } catch (error: any) {
    const theError = error?.message as string
    return { error: theError }
  }
}
