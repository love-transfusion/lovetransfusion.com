export interface I_ac_ContactList_Request {
  list: `${number}`
  contact: `${number}`
  status?: '1' | '2'
}

export interface ContactListReq {
  contactList: I_ac_ContactList_Request
}

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

export interface I_ac_Contact {
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
  anonymized: string
  adate: string
  udate: string
  deleted_at: string
  created_utc_timestamp: string
  updated_utc_timestamp: string
  links: ContactLinks
  id: string
  organization: string | null
}
export interface ContactListLinks {
  automation: string
  list: string
  contact: string
  form: string
  autosyncLog: string
  campaign: string
  unsubscribeAutomation: string
  message: string
}
export interface ContactListRes {
  contact: string
  list: string
  form: string | null
  seriesid: string
  sdate: string
  status: number
  responder: string
  sync: string
  unsubreason: string
  campaign: string | null
  message: string | null
  first_name: string
  last_name: string
  ip4Sub: string
  sourceid: string
  autosyncLog: string | null
  ip4_last: string
  ip4Unsub: string
  unsubscribeAutomation: string | null
  links: ContactListLinks
  id: string
  automation: string | null
}
export interface I_ac_ContactList_Response {
  contacts: I_ac_Contact[]
  contactList: ContactListRes
}
