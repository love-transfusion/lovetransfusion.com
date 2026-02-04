import React from 'react'
import { util_fb_comments } from '../utilities/facebook/util_fb_comments'

const page = async () => {
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/cron/recipients`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       authorization: `Bearer ${process.env.CRON_SECRET}`,
  //     },
  //     cache: 'no-store',
  //   },
  // )
const comments = await util_fb_comments({postId: '107794902571685_1286491916849449', pageAccessToken: process.env.FACEBOOK_PAGE_TOKEN!})
  return (
    <div>
      <pre>{JSON.stringify(comments, null, 2)}</pre>
    </div>
  )
}

export default page
