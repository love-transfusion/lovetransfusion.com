type pointer = string

export interface I_ac_errors_create_contact {
  title: string
  details: string
  code: string
  source: { pointer: pointer }
}

export interface I_ac_ContactFieldValue {
  field: string
  value: string
}

export interface I_ac_CreateContactRequest {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  fieldValues?: I_ac_ContactFieldValue[]
}

export interface I_ac_FieldValueLinks {
  owner: string
  field: string
}

export interface I_ac_DetailedFieldValue {
  contact: string
  field: string
  value: string
  cdate: string
  udate: string
  links: I_ac_FieldValueLinks
  id: string
  owner: string
}

export interface I_ac_ContactLinks {
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

export interface I_ac_DetailedContact {
  email: string
  cdate: string
  udate: string
  orgid: string
  links: I_ac_ContactLinks
  id: `${number}`
  organization: string
}

export interface I_ac_CreateContactResponse {
  fieldValues: I_ac_DetailedFieldValue[]
  contact: I_ac_DetailedContact
  message: string
  errors: I_ac_errors_create_contact
}
