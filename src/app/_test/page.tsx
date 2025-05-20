// export default TestPage
import React from 'react'
import { fetchPagePostComments } from './fetchPagePostComments'

const TestPage = async () => {
  const ad_id = '120225319914750267'
  const result = await fetchPagePostComments(ad_id)

  return <pre>{JSON.stringify(result, null, 2)}</pre>
}

export default TestPage
