import React from 'react'
import { util_fetchFacebookCampaigns } from '../utilities/facebook/fb_generateAppSecretProof'

const Test = async () => {
  const campaigns = await util_fetchFacebookCampaigns()
  return <pre>{JSON.stringify(campaigns, null, 2)}</pre>
}

export default Test
