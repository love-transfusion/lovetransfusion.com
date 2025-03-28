export interface I_Options {
  method: string
  headers: {
    accept: string
    'content-type': string
    'Api-Token'?: string
  }
  body?: string
}
export interface ActiveCampaignTag {
  id: string
  tag: string
}

export interface ActiveCampaignTagsResponse {
  tags: ActiveCampaignTag[]
}

export interface ActiveCampaignList {
  id: string
  name: string
}

export interface ActiveCampaignListsResponse {
  lists: ActiveCampaignList[]
}

interface I_field {
  field: string
  value: string
}

export interface I_ac_create_contact {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  fieldValues?: I_field[]
}

export interface I_ac_add_to_list {
  /**String of number */
  list: string
  /**String of number */
  contact: string
  /**String of number */
  status: '1' | '2'
}
