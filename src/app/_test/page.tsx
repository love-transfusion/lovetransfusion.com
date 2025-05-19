// import React from 'react'
// import { util_fetchAdWiseInsights } from '../utilities/facebook/util_facebookApi'

// const TestPage = async () => {
//   const ad_id = '120225319914750267'
//   const result = await util_fetchAdWiseInsights({ ad_id })

//   return <pre>{JSON.stringify(result, null, 2)}</pre>
// }

// export default TestPage
import React from 'react'
import { fetchPagePostComments } from './fetchPagePostComments'
// import { util_facebookInsights } from '../utilities/facebook/util_facebookInsights'

const TestPage = async () => {
  const ad_id = '120225319914750267'
  const result = await fetchPagePostComments(ad_id)

  return <pre>{JSON.stringify(result, null, 2)}</pre>
}

export default TestPage
