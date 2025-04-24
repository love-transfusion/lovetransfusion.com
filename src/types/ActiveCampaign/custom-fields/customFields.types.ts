export interface FieldLinks {
  options: string
  relations: string
}
export interface Field {
  title: string
  descript: string | null
  type: string
  isrequired: string // "1" or "0"
  perstag: string
  defval: string | null
  show_in_list: string // "1" or "0"
  rows: string
  cols: string
  visible: string // "1" or "0"
  service: string
  ordernum: string
  cdate: string
  udate: string
  options: unknown[] // can be typed later if needed
  relations: unknown[] // can be typed later if needed
  links: FieldLinks
  id: string
}
export interface FieldsMeta {
  total: string
}

export interface I_ac_FieldsResponse {
  fieldOptions: unknown[] // can be typed if you know the structure
  fieldRels: unknown[] // can be typed if you know the structure
  fields: Field[]
  meta: FieldsMeta
}
