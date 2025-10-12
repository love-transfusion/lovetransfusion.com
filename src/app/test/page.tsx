import React from 'react'
import { getCityBreakdownByPost } from './actions'

const page = async () => {
  const res = await getCityBreakdownByPost({
    postId: '107794902571685_1252531806912127', // or postId: '9876...', pageId: '1234...'
    since: '2025-10-01',
    until: '2025-10-10',
  })
  return (
    <div>
      <pre>{JSON.stringify(res, null, 2)}</pre>
    </div>
  )
}

export default page
