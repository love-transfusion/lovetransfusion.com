export interface ACContactFieldValue {
  field: string // field ID as string
  value: string // value for the field
}

export interface ACContactMinimal {
  email?: string
  firstName?: string
  lastName?: string
  fieldValues?: ACContactFieldValue[]
  phone?: string
}

export interface I_AC_Update_Contact_MinimalRequest {
  contact: ACContactMinimal
}

/* ------------------------- Field Values ------------------------- */
export interface ACFieldValueLinks {
  owner: string
  field: string
}

export interface ACFieldValue {
  contact: string
  field: string
  value: string | null
  cdate: string
  udate: string
  links: ACFieldValueLinks
  id: string
  owner: string
}

/* ------------------------- Contact ------------------------- */
export interface ACContactLinks {
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

export interface ACContactFull {
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
  udate: string | null
  edate: string | null
  deleted_at: string | null
  created_utc_timestamp: string
  updated_utc_timestamp: string
  links: ACContactLinks
  id: string
  organization: string | null
}

export interface ACErrorSource {
  pointer: string
}

export interface ACErrorResponse {
  status: number // HTTP status code (e.g., 422)
  title: string // Short error title
  detail: string // Human-readable explanation
  source: ACErrorSource // Object describing the error source
}

/* ------------------------- Root Response ------------------------- */
export interface I_AC_Update_ContactWithFieldValuesResponse {
  fieldValues: ACFieldValue[]
  contact: ACContactFull
  message: string
  errors?: ACErrorResponse[]
}
