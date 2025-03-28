import axios from 'axios'
import crypto from 'crypto'

const accessToken =
  'EAARZAo3JNZBTIBOyG5Dcy0YXw5ZBzdg7srlek0dNMrahDZBGvQ60KXn4ZCUFLLLneJCN3KWyhwAzZCW0agT3FRiKqWaiWzKx366iQLZCIgXn2CuXNQCrx2U7ZBXta42EiBAyXyVCmrGaeJ2bvkn0wvtjnxGjhY0ZBZB5l5loqtZAFzfkOa65SfZA1MBqUU3sVITf55iLF5CZAoAZDZD'!
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
