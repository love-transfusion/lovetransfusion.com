export interface ContactTag {
  contactTag: ContactTag
}
export interface I_ac_add_TagRequest {
  contact: `${number}`
  tag: `${number}`
}
export interface ContactTagLinks {
  contact: string
  tag: string
}
export interface ContactTagResponseData {
  cdate: string
  contact: string
  id: string
  links: ContactTagLinks
  tag: string
}
interface I_ac_errors_removeTag {
  title: string
  status: number
  detail: string
}
type pointer = { pointer: string }
interface I_ac_errors_removeTag2 {
  status: number
  title: string
  source: pointer
}
export interface I_ac_add_tag_toContact_Response {
  contactTag: ContactTagResponseData
  errors: I_ac_errors_removeTag | I_ac_errors_removeTag2
}
