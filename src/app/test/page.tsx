import React from 'react'
import axios from 'axios'
// import { util_facebookInsights } from '../utilities/facebook/util_facebookInsights'

const TestPage = async () => {
  const ad_id = '120220931146070267'
  const token = process.env.FACEBOOK_API_KEY

  const getData = async () => {
    // Step 1: Get the post ID from ad creative
    try {
      const creativeRes = await axios.get(
        `https://graph.facebook.com/v17.0/${ad_id}?fields=creative{effective_object_story_id}&access_token=${token}`
      )
      // console.log({ creativeRes })
      const postId = creativeRes.data.creative.effective_object_story_id
      console.log({ postId })

      // Step 2: Fetch comments from the post
      const commentsRes = await axios.get(
        `https://graph.facebook.com/v17.0/${postId}/comments?access_token=${token}`
      )
      console.log(
        'Raw comments response:',
        JSON.stringify(commentsRes.data, null, 2)
      )
      console.log({ commentsRes })

      const comments = commentsRes.data.data
      // console.log({ comments })
      return { data: comments, error: null }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        console.error(
          '❌ Facebook API 400 Error:',
          JSON.stringify(error.response.data, null, 2)
        )
      } else {
        console.error('❌ Other Error:', error.message)
      }
      return { data: null, error: error.message }
    }
  }
  const comments = await getData()

  return <pre>{JSON.stringify(comments, null, 2)}</pre>
}

export default TestPage
