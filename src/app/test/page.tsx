import React from 'react'
import { fetchAdWiseInsights } from '../utilities/facebook/util_facebookApi'
// import { util_facebookInsights } from '../utilities/facebook/util_facebookInsights'

const TestPage = async () => {
  const token =
    'EAARZAo3JNZBTIBO2CZCUQgshjqTjDB5ya7ypZBo0ZBiL0ZBifO9cmec5IY9vZAvknbSxKTPd6IPHSoJZCd2WE8GUmEQwADiTG4OehROB6m4mAFjR1SUaU87rxRR1RuOll9Sv4LqfJwZCKdwOWMVEm5aD5F8RqDpon1jxuoyB8sVnTvffdvEhih7VakXhzPfoJ4QYWgG6fdQZDZD'
  const accountId = '3519590174999724'
  const apiVersion = 'v22.0'
  const datePreset = 'maximum'
  if (!token || !accountId) {
    return
  }
  const fetchAdWiseOnlyInsights = async () => {
    try {
      const adWiseData = await fetchAdWiseInsights(
        token,
        accountId,
        apiVersion,
        datePreset
      )
      return JSON.stringify({ adWiseInsights: adWiseData }, null, 2)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(
        `Error fetching ad-wise insights: ${err.message || 'Unknown error'}`
      )
    }
  }
  const data = await fetchAdWiseOnlyInsights()
  console.log({ data })
  return <pre>{data}</pre>
}

export default TestPage
