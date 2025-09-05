import React from 'react'
import { createServer } from '../config/supabase/supabaseServer'
import { seedPostFromAd } from '../utilities/facebook/new/helpers/seedPostFromAd'

const TestPage = async () => {
  await seedPostFromAd(
    '120225319914750267',
    process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
    'cebb19de-a9c3-4142-81fb-624316fc6b59'
  )
  const supabase = await createServer()
  const { data } = await supabase
    .from('users')
    .select('*, facebook_posts(*, facebook_comments(*))')
  console.log({ data })
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default TestPage
