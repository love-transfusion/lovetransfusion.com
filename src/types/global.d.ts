import { analyticsdata_v1beta } from 'googleapis'
import { Database as DB } from './database.types'
import { Database as orgDB } from './ltorgDatabase.types'
import { UUID } from './utils.types'
import { User } from '@supabase/supabase-js'

interface extended_supaorg_recipient extends I_supaOrg_recipients_row {
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
  type I_supa_unextended_users_data_website_row =
    DB['public']['Tables']['users_data_website']['Row']
  interface I_supa_users_data_website_row
    extends Omit<I_supa_unextended_users_data_website_row, 'recipient'> {
    recipient: jsonb
  }

  // receipients_deleted_messages table
  type I_supa_receipients_deleted_messages_insert =
    DB['public']['Tables']['receipients_deleted_messages']['Insert']
  type I_supa_receipients_deleted_messages_update =
    DB['public']['Tables']['receipients_deleted_messages']['Update']
  type I_supa_receipients_deleted_messages_row =
    DB['public']['Tables']['receipients_deleted_messages']['Row']

  // users_data_facebook table
  type I_supa_users_data_facebook_insert =
    DB['public']['Tables']['users_data_facebook']['Insert']
  type I_supa_users_data_facebook_update =
    DB['public']['Tables']['users_data_facebook']['Update']
  type I_supa_users_data_facebook_row =
    DB['public']['Tables']['users_data_facebook']['Row']

  // facebook_comments table
  type I_supa_facebook_comments_insert =
    DB['public']['Tables']['facebook_comments']['Insert']
  type I_supa_facebook_comments_update =
    DB['public']['Tables']['facebook_comments']['Update']
  type I_supa_facebook_comments_row =
    DB['public']['Tables']['facebook_comments']['Row']

  // facebook_insights table
  type I_supa_facebook_insights_insert =
    DB['public']['Tables']['facebook_insights']['Insert']
  type I_supa_facebook_insights_update =
    DB['public']['Tables']['facebook_insights']['Update']
  type I_supa_facebook_insights_row =
    DB['public']['Tables']['facebook_insights']['Row']

  // facebook_posts table
  type I_supa_facebook_posts_insert =
    DB['public']['Tables']['facebook_posts']['Insert']
  type I_supa_facebook_posts_update =
    DB['public']['Tables']['facebook_posts']['Update']
  type I_supa_facebook_posts_row =
    DB['public']['Tables']['facebook_posts']['Row']

  // profile_pictures table
  type I_supa_profile_pictures_insert =
    DB['public']['Tables']['profile_pictures']['Insert']
  type I_supa_profile_pictures_update =
    DB['public']['Tables']['profile_pictures']['Update']
  type I_supa_profile_pictures_row_unextended =
    DB['public']['Tables']['profile_pictures']['Row']

  // fb_adwise_insights table
  type I_supa_fb_adwise_insights_insert =
    DB['public']['Tables']['fb_adwise_insights']['Insert']
  type I_supa_fb_adwise_insights_update =
    DB['public']['Tables']['fb_adwise_insights']['Update']
  type I_supa_fb_adwise_insights_row_unextended =
    DB['public']['Tables']['fb_adwise_insights']['Row']

  // recipients table
  type I_supa_recipients_insert = DB['public']['Tables']['recipients']['Insert']
  type I_supa_recipients_update = DB['public']['Tables']['recipients']['Update']
  type I_supa_recipients_row = DB['public']['Tables']['recipients']['Row']

  // tooltips table
  type I_supa_tooltips_insert = DB['public']['Tables']['tooltips']['Insert']
  type I_supa_tooltips_update = DB['public']['Tables']['tooltips']['Update']
  type I_supa_tooltips_row_unextended =
    DB['public']['Tables']['tooltips']['Row']

  // tooltips_user_status table
  type I_supa_tooltips_user_status_insert =
    DB['public']['Tables']['tooltips_user_status']['Insert']
  type I_supa_tooltips_user_status_update =
    DB['public']['Tables']['tooltips_user_status']['Update']
  type I_supa_tooltips_user_status_row_unextended =
    DB['public']['Tables']['tooltips_user_status']['Row']

  // users table
  type I_supa_users_insert = DB['public']['Tables']['users']['Insert']
  type I_supa_users_update = DB['public']['Tables']['users']['Update']
  type I_supa_users_row = DB['public']['Tables']['users']['Row']
  interface I_supa_users_with_profpic_dataweb extends I_supa_users_row {
    profile_pictures: I_supa_profile_pictures_row_unextended | null
    users_data_website: I_supa_users_data_website_row[]
  }

  // Enums
  type I_supa_enumTypes_role = DB['public']['Enums']['role']

  // Utilities
  type UUID = `${string}-${string}-${string}-${string}-${string}`

  interface I_User extends User, I_supa_users_row {
    role: I_supa_enumTypes_role
    users_data_website: I_supa_users_data_website_row[]
    profile_pictures: I_supa_profile_pictures_row_unextended | null
  }

  type I_AnalyticsData = analyticsdata_v1beta.Schema$RunReportResponse

  interface I_profile_picture {
    blurDataURL: string
    fullPath: string
    id: UUID
    path: string
  }

  // LT.org Database

  type I_supaorg_public_profiles =
    | orgDB['public']['Tables']['public_profiles']['Row'] & {
        profile_picture: I_profile_picture | null
      }

  type I_orgLocation =
    | {
        IP: string
        city: string
        country: string
        country_code: string
        region: string
        latitude: number
        longitude: number
        cityId: undefined
        countryId: undefined
      }
    | null
    | undefined

  // recipients table
  type I_supaOrg_recipients_insert =
    orgDB['public']['Tables']['recipients']['Insert']
  type I_supaOrg_recipients_update =
    orgDB['public']['Tables']['recipients']['Update']
  type I_supaOrg_recipients_row = orgDB['public']['Tables']['recipients']['Row']

  // comments table
  type I_supaOrg_comments_insert =
    orgDB['public']['Tables']['comments']['Insert']
  type I_supaOrg_comments_update =
    orgDB['public']['Tables']['comments']['Update']
  type I_supaOrg_comments_row = orgDB['public']['Tables']['comments']['Row']

  // recipients_profile_pictures table
  type I_supaOrg_recipients_profile_pictures_insert =
    orgDB['public']['Tables']['recipients_profile_pictures']['Insert']
  type I_supaOrg_recipients_profile_pictures_update =
    orgDB['public']['Tables']['recipients_profile_pictures']['Update']
  type I_supaOrg_recipients_profile_pictures_row =
    orgDB['public']['Tables']['recipients_profile_pictures']['Row']

  interface I_supaorg_hug extends I_unextended_supaorg_hug {
    location: I_orgLocation | null
  }
  type I_unextended_supaorg_hug = orgDB['public']['Tables']['hugs']['Row'] & {
    public_profiles: I_supaorg_public_profiles | null
  }

  // hugs table
  type I_supaOrg_hugs_insert = orgDB['public']['Tables']['hugs']['Insert']
  type I_supaOrg_hugs_update = orgDB['public']['Tables']['hugs']['Update']
  type I_supaOrg_hugs_row = orgDB['public']['Tables']['hugs']['Row']

  // recipient_counters table
  type I_supaOrg_recipient_counters_insert =
    orgDB['public']['Tables']['recipient_counters']['Insert']
  type I_supaOrg_recipient_counters_update =
    orgDB['public']['Tables']['recipient_counters']['Update']
  type I_supaOrg_recipient_counters_row =
    orgDB['public']['Tables']['recipient_counters']['Row']

  interface I_supaorg_comments extends I_unextended_supaorg_comments {
    location: I_orgLocation | null
  }
  type I_unextended_supaorg_comments =
    orgDB['public']['Tables']['comments']['Row'] & {
      public_profiles: I_supaorg_public_profiles | null
    }

  type I_supaorg_recipient_hugs_counters_comments =
    extended_supaorg_recipient & {
      hugs: I_supaorg_hug[]
      recipient_counters: I_supaOrg_recipient_counters_row | null
      comments: I_supaorg_comments[]
    }

  // Org Enums
  type I_supaorg_enumTypes_page_status = orgDB['public']['Enums']['page_status']
}
