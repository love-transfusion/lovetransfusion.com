'use server'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { I_Auth_UserRole } from '@/types/auth.types'
import { UUID } from '@/types/utils.types'
import { User } from '@supabase/supabase-js'

type I_CreateUserRole = Promise<
  | {
      user: User
    }
  | undefined
>

export const supa_admin_createUserRole = async (
  userId: UUID,
  role: I_Auth_UserRole
): I_CreateUserRole => {
  const supabase = await createAdmin()
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    role,
  })

  if (error) console.error(error)
  else {
    console.log('User role updated:', data)
    return data
  }
}
