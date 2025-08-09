/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'

export async function fetchPagePostComments(ad_id: string) {
  const userToken = process.env.FACEBOOK_USER_TOKEN! // User Long-Lived Token
  const pageToken = process.env.FACEBOOK_PAGE_TOKEN! // Page Token (from Page itself)

  try {
    // ✅ Step 1: Get creative using USER Token
    const creativeRes = await axios.get(
      `https://graph.facebook.com/v17.0/${ad_id}?fields=creative{effective_object_story_id}&access_token=${userToken}`
    )
    const postId = creativeRes?.data?.creative?.effective_object_story_id

    // ✅ Step 2: Confirm post is accessible using PAGE Token
    const postRes = await axios.get(
      `https://graph.facebook.com/v17.0/${postId}?access_token=${pageToken}`
    )

    // ✅ Step 3: Fetch comments using PAGE Token
    const commentsRes = await axios.get(
      `https://graph.facebook.com/v17.0/${postId}/comments?fields=message,from,created_time&access_token=${pageToken}`
    )

    return { data: commentsRes.data.data, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const fbError = error.response.data.error
    }
    return { data: null, error: error.message }
  }
}
