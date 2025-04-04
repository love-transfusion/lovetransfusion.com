import React from 'react'
import { util_facebookInsights } from '../utilities/facebook/util_facebookInsights'

const Test = async () => {
  const campaigns = await util_facebookInsights({
    clLevel: 'ad',
    clAdId: '120207964954460267',
  })
  return <pre>{JSON.stringify(campaigns, null, 2)}</pre>
}

export default Test
