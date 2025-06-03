// export default TestPage
import React from 'react'
import { fetchPagePostComments } from './fetchPagePostComments'
import CopyToken from './CopyToken'

const TestPage = async () => {
  const ad_id = '120225319914750267'
  const result = await fetchPagePostComments(ad_id)

  return (
    <>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <CopyToken userToken={process.env.FACEBOOK_USER_TOKEN!} pageToken={process.env.FACEBOOK_PAGE_TOKEN!} />
    </>
  )
}

export default TestPage
