// import Image from 'next/image'
// import React from 'react'
// import { util_fb_comments } from '../utilities/facebook/util_fb_comments'
// import { supa_select_facebook_pages_pageToken } from '../_actions/facebook_pages/actions'

const page = async () => {
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/meta/avatar/25054155760837878/56`,
  //   // `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/meta/avatar/24788736987452612/56`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       authorization: `Bearer ${process.env.CRON_SECRET}`,
  //     },
  //     cache: 'no-store',
  //   },
  // )
  // const { data } = await supa_select_facebook_pages_pageToken({
  //   clFacebookPageID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
  // })
  
  // if (!data) return
  // const { data: comments, error } = await util_fb_comments({
  //   pageAccessToken: data.page_token,
  //   postId: '107794902571685_836972225134756',
  // })
  // console.log({ comments })
  // const ids = [
  //   '25054155760837878',
  //   '24124212293907600',
  //   '30504292169215988',
  //   '30784606017853541',
  //   '24359612213678758',
  //   '24591116890472405',
  //   '25031881356400573',
  //   '24788736987452612',
  // ]
  return (
    <div>
      {/* <pre>{JSON.stringify(comments, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(res, null, 2)}</pre> */}
      {/* {ids.map((id) => {
        return (
          <Image
            key={id}
            src={`/api/meta/avatar/${id}/128`}
            className="h-[128px] w-[128px] rounded-full bg-red-50"
            alt={'User'}
            width={128}
            height={128}
          />
        )
      })} */}
      {/* <Image
        src={`/api/meta/avatar/24788736987452612/128`}
        className="h-[128px] w-[128px] rounded-full bg-red-50"
        alt={'User'}
        width={128}
        height={128}
      /> */}
      {/* <pre>{JSON.stringify(res, null, 2)}</pre> */}
    </div>
  )
}

export default page
