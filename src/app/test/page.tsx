import React from 'react'
import { util_fb_postID } from '../utilities/facebook/new/util_fb_postID'
import { util_fb_profile_picture } from '../utilities/facebook/new/util_fb_profile_picture'
import { util_fb_pageToken } from '../utilities/facebook/new/util_fb_pageToken'

const TestPage = async () => {
  const { data: postID } = await util_fb_postID({ adId: '120230772034920267' })

  const { data: pageAccessToken } = await util_fb_pageToken({
    pageId: '107794902571685',
  })
  const profile = await util_fb_profile_picture({
    clIDs: ['9879847132046047'],
    clAccessToken: pageAccessToken!,
    clImageDimensions: 64,
  })
  return (
    <>
      <pre>{JSON.stringify(postID, null, 2)}</pre>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </>
  )
}

export default TestPage
