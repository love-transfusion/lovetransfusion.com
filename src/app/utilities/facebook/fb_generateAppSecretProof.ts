import axios from 'axios'
import crypto from 'crypto'

const accessToken =
  'EAARZAo3JNZBTIBOxQUiheTK2gzZAqWKHfTyQ6boo6FfkZAPZCqFdxm5KIeN7W8ZChj4hUZCoBOjH56rlzcOBicsPgqWGysIVSTTNsuzlKKvuDb17xIEhhYxsUihfaYEz4ZBrfbrA9VaL7xvkDsd5gMpv9a9O9uQoFTQUxiit3sKLTe3fLzfagvIdUPJ1dPG00ZAiW77P1gQZDZD'!
const appSecret = '67a182b4525202f51a6d6604bc5e7d66'!
const adAccountId = '3519590174999724'!

function generateAppSecretProof(token: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(token).digest('hex')
}

export const util_fetchFacebookCampaigns = async () => {
  const appsecret_proof = generateAppSecretProof(accessToken, appSecret)

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${adAccountId}/campaigns`,
      {
        params: {
          access_token: accessToken,
          appsecret_proof,
          fields: 'id,name,status', // Customize as needed
        },
      }
    )
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Facebook API error:', err.response?.data || err.message)
    throw err
  }
}
