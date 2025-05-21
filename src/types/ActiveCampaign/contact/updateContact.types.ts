export interface ActiveCampaignFieldValue {
  field: string // ID of the custom field as a string
  value: string // Value associated with that field
}

export interface ActiveCampaignContact {
  email?: string
  firstName?: string
  lastName?: string
  fieldValues?: ActiveCampaignFieldValue[]
}

export interface I_ac_ActiveCampaignContactPayload {
  clID: number
  clContact: ActiveCampaignContact
}

export interface ActiveCampaignFieldValueLink {
  owner: string
  field: string
}

export interface ActiveCampaignFieldValueResponse {
  contact: string
  field: string
  value: string
  cdate: string
  udate: string
  links: ActiveCampaignFieldValueLink
  id: string
  owner: string
}

export interface ActiveCampaignContactLinks {
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

export interface ActiveCampaignContactResponse {
  cdate: string
  email: string
  phone: string
  firstName: string
  lastName: string
  orgid: string
  segmentio_id: string
  bounced_hard: string
  bounced_soft: string
  bounced_date: string | null
  ip: string
  ua: string | null
  hash: string
  socialdata_lastcheck: string | null
  email_local: string
  email_domain: string
  sentcnt: string
  rating_tstamp: string | null
  gravatar: string
  deleted: string
  anonymized: string
  adate: string | null
  udate: string
  edate: string | null
  deleted_at: string | null
  created_utc_timestamp: string
  updated_utc_timestamp: string
  links: ActiveCampaignContactLinks
  id: string
  organization: string | null
}

export interface ActiveCampaignErrorSource {
  pointer: string
}

export interface ActiveCampaignErrorItem {
  status: number
  title: string
  detail: string
  source: ActiveCampaignErrorSource
}

export interface ac_ActiveCampaignContactResponse {
  fieldValues: ActiveCampaignFieldValueResponse[]
  contact: ActiveCampaignContact
  message: string
  errors: ActiveCampaignErrorItem[]
}
