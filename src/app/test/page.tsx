import React from 'react'
import { util_fetchAdComments } from '../utilities/facebook/util_fetchAdComments'
import { util_fetchFBAdShareCount } from '../utilities/facebook/util_fetchFBAdShareCount'
import { util_getFBPageAccessToken } from '../utilities/facebook/util_getFBPageAccessToken'
import { util_getFBPostID } from '../utilities/facebook/util_getFBPostID'

const TestPage = async () => {
  const systemToken = process.env.FACEBOOK_SYSTEM_TOKEN!
  const pageId = '107794902571685'
  const adIds = ['120230770928740267']

  const postID = await util_getFBPostID({ adId: adIds[0], systemToken })

  const pageAccessToken = await util_getFBPageAccessToken({
    pageId,
    systemToken,
  })

  const { data, paging, error } = await util_fetchAdComments({
    limit: 10000000,
    pageAccessToken,
    postID,
    systemToken,
  })

  const { count: shareCount, error: shareCountError } =
    await util_fetchFBAdShareCount({ pageAccessToken, postID })
  if (error || shareCountError) {
    return <p className={''}>{error || shareCountError}</p>
  }
  return (
    <div>
      <p className={''}>Shares: {shareCount}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(paging, null, 2)}</pre>
    </div>
  )
}

export default TestPage
