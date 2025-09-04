import React from 'react'
import { seedPostFromAd } from '../_actions/facebook_posts/actions/seedPostFromAd'
import { env_FACEBOOK_PAGE_ID } from '../lib/facebook/constants'
import { createAdmin } from '../config/supabase/supabaseAdmin'

const TestPage = async () => {
  await seedPostFromAd(
    '120225320012640267',
    env_FACEBOOK_PAGE_ID,
    'b03c0074-e175-47f7-b523-772755338ddd'
  )
  const supabase = await createAdmin()
  const { data } = await supabase
    .from('users')
    .select('*, facebook_posts(*, facebook_comments(*))')
  console.log({ data })
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default TestPage
