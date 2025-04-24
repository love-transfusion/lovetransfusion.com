export type TagType = 'contact' | 'template'

export interface I_ac_TagLinks {
  contactGoalTags: string
}

export interface I_ac_Tag_list_all {
  tagType: TagType
  tag: string
  description: string
  cdate: string // ISO 8601 datetime string
  links: I_ac_TagLinks
  id: string
}

export interface I_ac_TagsResponseMeta {
  total: string
}

export interface I_ac_list_all_TagsResponse {
  tags: I_ac_Tag_list_all[]
  meta: I_ac_TagsResponseMeta
}