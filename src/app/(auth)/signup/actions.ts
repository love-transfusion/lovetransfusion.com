'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'
import { v4 as uuid } from 'uuid'

interface I_signupData {
  first_name: string
  last_name: string
  email: string
}

export const supa_signup = async (rawData: I_signupData) => {
  const supabase = await createServer()

  const password = uuid()
  await supabase.auth.signUp({
    email: rawData.email,
    password: password,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      // shouldCreateUser: false,
      data: {
        first_name: rawData.first_name,
        last_name: rawData.last_name,
      },
    },
  })
}
