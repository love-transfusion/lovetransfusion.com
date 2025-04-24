/* eslint-disable @typescript-eslint/no-explicit-any */
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
  // This is contact id
  contact: string
  /**String of number */
  status: '1' | '2'
}

export interface I_ac_contact {
  cdate: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  orgid: string;
  orgname: string;
  segmentio_id: string;
  bounced_hard: string;
  bounced_soft: string;
  bounced_date: string | null;
  ip: string;
  ua: string;
  hash: string;
  socialdata_lastcheck: string | null;
  email_local: string;
  email_domain: string;
  sentcnt: string;
  rating_tstamp: string | null;
  gravatar: string;
  deleted: string;
  anonymized: string;
  adate: string;
  udate: string;
  edate: string;
  deleted_at: string | null;
  created_utc_timestamp: string;
  updated_utc_timestamp: string;
  created_timestamp: string;
  updated_timestamp: string;
  created_by: string;
  updated_by: string;
  mpp_tracking: string;
  last_click_date: string | null;
  last_open_date: string | null;
  last_mpp_open_date: string | null;
  best_send_hour: string;
  accountContacts: any[]; // You can replace `any` with a more specific type if known
  scoreValues: any[];     // Same here
  id: string;
  organization: any | null; // You can define a nested type if needed
}
