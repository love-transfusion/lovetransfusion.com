import { Database } from '@/types/database.types'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export async function createAdmin(): Promise<SupabaseClient<Database>> {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  // Access auth admin api
}
