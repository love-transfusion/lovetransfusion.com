export interface I_AC_Retrieved_ContactResponse extends ACContactResponse {
  message: string
}

// Root response
export interface ACContactResponse {
  contactAutomations: ACContactAutomation[]
  contactLists: ACContactList[]
  deals: ACDeal[]
  fieldValues: ACFieldValue[]
  geoAddresses: ACGeoAddress[]
  geoIps: ACGeoIp[]
  contact: ACContact
}

/* ------------------------- Contact Automations ------------------------- */
export interface ACContactAutomation {
  contact: string
  seriesid: string
  startid: string
  status: string
  adddate: string
  remdate: string | null
  timespan: string | null
  lastblock: string
  lastdate: string
  completedElements: string
  totalElements: string
  completed: number
  completeValue: number
  links: {
    automation: string
    contact: string
    contactGoals: string
  }
  id: string
  automation: string
}

/* ------------------------- Contact Lists ------------------------- */
export interface ACContactList {
  contact: string
  list: string
  form: string | null
  seriesid: string
  sdate: string | null
  udate: string | null
  status: string
  responder: string
  sync: string
  unsubreason: string | null
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
  links: {
    automation: string
    list: string
    contact: string
    form: string
    autosyncLog: string
    campaign: string
    unsubscribeAutomation: string
    message: string
  }
  id: string
  automation: string | null
}

/* ------------------------- Deals ------------------------- */
export interface ACDeal {
  owner: string
  contact: string
  organization: string | null
  group: string | null
  title: string
  nexttaskid: string
  currency: string
  status: string
  links: {
    activities: string
    contact: string
    contactDeals: string
    group: string
    nextTask: string
    notes: string
    organization: string
    owner: string
    scoreValues: string
    stage: string
    tasks: string
  }
  id: string
  nextTask: string | null
}

/* ------------------------- Field Values ------------------------- */
export interface ACFieldValue {
  contact: string
  field: string
  value: string | null
  cdate: string
  udate: string
  links: {
    owner: string
    field: string
  }
  id: string
  owner: string
}

/* ------------------------- Geo Addresses ------------------------- */
export interface ACGeoAddress {
  ip4: string
  country2: string
  country: string
  state: string
  city: string
  zip: string
  area: string
  lat: string
  lon: string
  tz: string
  tstamp: string
  links: string[]
  id: string
}

/* ------------------------- Geo Ips ------------------------- */
export interface ACGeoIp {
  contact: string
  campaignid: string
  messageid: string
  geoaddrid: string
  ip4: string
  tstamp: string
  geoAddress: string
  links: {
    geoAddress: string
  }
  id: string
}

/* ------------------------- Contact ------------------------- */
export interface ACContact {
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
  adate: string | null
  udate: string | null
  edate: string | null
  contactAutomations: string[]
  contactLists: string[]
  fieldValues: string[]
  geoIps: string[]
  deals: string[]
  accountContacts: string[]
  links: {
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
  id: string
  organization: string | null
}
