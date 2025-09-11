import { I_AC_Retrieved_ContactResponse } from './contactRetrieved.types'

export interface ContactLinks {
  bounceLogs: string
  contactAutomations: string
  contactData: string
  contactGoals: string
  contactLists: string
  contactLogs: string
  contactTags: string
  contactDeals: string
  deals: string
  fieldValues: string
  geoIps: string
  notes: string
  organization: string
  plusAppend: string
  trackingLogs: string
  scoreValues: string
}
export interface Contact {
  cdate: string
  email: string
  phone: string
  firstName: string
  lastName: string
  orgid: string
  segmentio_id: string
  bounced_hard: string
  bounced_soft: string
  bounced_date: string
  ip: string
  ua: string
  hash: string
  socialdata_lastcheck: string
  email_local: string
  email_domain: string
  sentcnt: string
  rating_tstamp: string
  gravatar: string
  deleted: string
  adate: string
  udate: string
  edate: string
  scoreValues: unknown[] // or a specific type if known
  accountContacts?: string[] // only present on some contacts
  links: ContactLinks
  id: `${number}`
  organization: string | null
}
export interface ContactSearchMetaPageInput {
  segmentid: number | null
  formid: number
  listid: number
  tagid: number
  limit: number
  offset: number
  search: string | null
  sort: string | null
  seriesid: number
  waitid: number
  status: number
  forceQuery: number
  cacheid: string
}
export interface ContactSearchMeta {
  total: string
  page_input: ContactSearchMetaPageInput
}

export interface Contact_Extended extends Contact {
  important_data: Omit<I_AC_Retrieved_ContactResponse, 'message'> | null
}

export interface I_ac_Contact_Search_Response {
  contacts: Contact[]
  meta: ContactSearchMeta
}
export interface I_ac_Contact_Search_Response_Extended {
  contacts: Contact_Extended[]
  meta: ContactSearchMeta
}
