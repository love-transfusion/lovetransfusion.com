import React from 'react'
// import { fetchCommentsSmart } from './fetchCommentsSmart'
import { fetchAdComments } from './fetchComments'
// import { fetchPagesForAdAccount } from './fetchPagesForAdAccount'
// import { fetchPostComments } from './fetchPostComments'
// import { fetchAllPostIds } from './fetchPostIDs'

const TestPage = async () => {
  // await fetchPostComments({
  //   postId:
  //     '120231126192100267',
  //   systemToken: process.env.FACEBOOK_SYSTEM_TOKEN!,
  // })

  //   await fetchAllPostIds({
  //     systemToken: process.env.FACEBOOK_SYSTEM_TOKEN!,
  //     adAccountId: process.env.Ad_Account_ID!,
  //     pageId: '107794902571685',
  //   })

  //   await fetchPagesForAdAccount({
  //     systemToken: process.env.FACEBOOK_SYSTEM_TOKEN!,
  //     adAccountId: process.env.Ad_Account_ID!,
  //   })
  //   await fetchPagesForAdAccount({
  //     systemToken: process.env.FACEBOOK_SYSTEM_TOKEN!,
  //     adAccountId: process.env.Ad_Account_ID!,
  //   })

  //   const comments = await fetchCommentsSmart(
  //     'https://www.facebook.com/LoveTransfusion/posts/pfbid02UtFAmoGfczUS5ucTUz77A5asje4mqJ6SedeWpUq4Fd4LyYpE6JXsvyVK2sLC2SAFl',
  //     {
  //       systemToken: process.env.FB_SYSTEM_USER_TOKEN!,
  //       pageToken: process.env.FB_PAGE_ACCESS_TOKEN, // optional but fixes NPE feed/comments
  //     },
  //     {
  //       pageId: '107794902571685',
  //       order: 'chronological',
  //       limit: 100,
  //     }
  //   )
  const pageId = '107794902571685'
  //   const adId = '120231016037920267'
  const adId = '120225320012640267'
  const { data, paging, error } = await fetchAdComments({
    pageId,
    adId,
    // flatten: true,
    limit: 100000,
  })
  if (error) {
    return <p className={''}>{error}</p>
  }
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(paging, null, 2)}</pre>
    </div>
  )
}

export default TestPage
