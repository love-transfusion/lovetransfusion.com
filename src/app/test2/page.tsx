import React from 'react'
import { util_fb_reachByRegion_multiAds } from '../utilities/facebook/util_fb_reachByRegion_multiAds'

const Test2 = async () => {
  const data = await util_fb_reachByRegion_multiAds({
    endAnchor: '37mon',
    post_id: '107794902571685_1240985804733392',
  })
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Test2
