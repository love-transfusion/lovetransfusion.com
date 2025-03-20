import { Database as DB } from './database.types'
import { Database as orgDB } from './ltorgDatabase.types'

declare global {
  // users_data_website table
  type I_supa_users_data_website_insert =
    DB['public']['Tables']['users_data_website']['Insert']
  type I_supa_users_data_website_update =
    DB['public']['Tables']['users_data_website']['Update']
  type I_supa_users_data_website_row =
    DB['public']['Tables']['users_data_website']['Row']

  type I_supa_enumTypes = DB['public']['Enums']['role']

  type Params = Promise<{ params: string; searchParams }>
  type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

  type I_supaorg_recipient = orgDB['public']['Tables']['recipients']['Row']
  type I_supaorg_hug = orgDB['public']['Tables']['hugs']['Row']
  type I_supaorg_recipient_counters =
    orgDB['public']['Tables']['recipient_counters']['Row']
  type I_supaorg_comments = orgDB['public']['Tables']['comments']['Row']
}
