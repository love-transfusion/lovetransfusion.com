export interface I_Comments_Facebook {
  type: 'facebook'
  name: string
  id: string
  message: string
  created_at: string
  profile_picture?: string
}

export interface I_Comments_Instagram {
  type: 'instagram'
  name: string
  id: string
  message: string
  created_at: string
  profile_picture?: string
}

export interface I_Comments_Website {
  type: 'website'
  name: string
  id: string
  message: string
  created_at: string
  profile_picture_website: I_supaorg_public_profiles | null
}

// Union type
export type I_Comments =
  | I_Comments_Facebook
  | I_Comments_Instagram
  | I_Comments_Website
