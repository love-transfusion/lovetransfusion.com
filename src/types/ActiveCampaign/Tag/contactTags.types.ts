interface RetrievedTagLinks {
  tag: string
  contact: string
}
export interface RetrievedTag {
  contact: string
  tag: string
  cdate: string
  created_timestamp: string
  updated_timestamp: string
  created_by: string | null
  updated_by: string | null
  links: RetrievedTagLinks
  id: string
}
export interface ac_contactTag_Response {
  contactTags: RetrievedTag[]
  message: string
}
