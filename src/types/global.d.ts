import { analyticsdata_v1beta } from 'googleapis'
import { Database as DB } from './database.types'
import { Database as orgDB } from './ltorgDatabase.types'
import { UUID } from './utils.types'

interface extended_supaorg_recipient extends I_supaorg_recipient {
  profile_picture: {
    id: UUID
    path: string
    fullPath: string
    owner_id: UUID
    created_at: string
    blurDataURL: string
  }
}

declare global {
  // users_data_website table
  type I_supa_users_data_website_insert =
    DB['public']['Tables']['users_data_website']['Insert']
  type I_supa_users_data_website_update =
    DB['public']['Tables']['users_data_website']['Update']
  type I_supa_users_data_website_row =
    DB['public']['Tables']['users_data_website']['Row']

  // users table
  type I_supa_users_insert = DB['public']['Tables']['users']['Insert']
  type I_supa_users_update = DB['public']['Tables']['users']['Update']
  type I_supa_users_row = DB['public']['Tables']['users']['Row']

  // Enums
  type I_supa_enumTypes_role = DB['public']['Enums']['role']

  // Utilities
  type UUID = `${string}-${string}-${string}-${string}-${string}`

  type I_AnalyticsData = analyticsdata_v1beta.Schema$RunReportResponse

  interface I_profile_picture {
    blurDataURL: string
    fullPath: string
    id: UUID
    path: string
  }

  // LT.org Database

  type I_supaorg_recipient = orgDB['public']['Tables']['recipients']['Row']

  type I_supaorg_public_profiles =
    | orgDB['public']['Tables']['public_profiles']['Row'] & {
        profile_picture: I_profile_picture | null
      }

  type I_supaorg_hug = orgDB['public']['Tables']['hugs']['Row'] & {
    public_profiles: I_supaorg_public_profiles | null
  }

  type I_supaorg_recipient_counters =
    orgDB['public']['Tables']['recipient_counters']['Row']

  type I_supaorg_comments = orgDB['public']['Tables']['comments']['Row'] & {
    public_profiles: I_supaorg_public_profiles | null
  }

  type I_supaorg_recipient_hugs_counters_comments =
    extended_supaorg_recipient & {
      hugs: I_supaorg_hug[]
      recipient_counters: I_supaorg_recipient_counters | null
      comments: I_supaorg_comments[]
    }
}
