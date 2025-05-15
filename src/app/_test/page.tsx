import React from 'react'
import { util_fetchAdWiseInsights } from '../utilities/facebook/util_facebookApi'
import { supa_insert_fb_adwise_insights } from '../_actions/fb_adwise_insights/actions'
// import { util_facebookInsights } from '../utilities/facebook/util_facebookInsights'

const TestPage = async () => {
  const token = process.env.FACEBOOK_API_KEY
  const ad_id = '120207965691030267'
  if (!token || !ad_id) {
    return
  }
  const fetchAdWiseOnlyInsights = async () => {
    try {
      const adWiseData = await util_fetchAdWiseInsights({
        ad_id,
      })
      return adWiseData
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(
        `Error fetching ad-wise insights: ${err.message || 'Unknown error'}`
      )
    }
  }
  const data = await fetchAdWiseOnlyInsights()


  const { data: dbData, error } = await supa_insert_fb_adwise_insights(data)
  console.log({ dbData, error })
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default TestPage
