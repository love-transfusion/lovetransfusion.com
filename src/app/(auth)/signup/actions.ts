'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'
import { v4 as uuid } from 'uuid'

interface I_signupData {
  parent_name: string
  email: string
}

export const supa_signup = async (rawData: I_signupData) => {
  // currently unused
  const supabase = await createServer()
  const { email, parent_name } = rawData

  const password = uuid().slice(0, 6)
  await supabase.auth.signUp({
    email,
    password: password,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      // shouldCreateUser: false,
      data: {
        parent_name,
      },
    },
  })
}
