import axios from 'axios'
import crypto from 'crypto'

const getDate = async () => {
  const date = new Date()
  const year = date.getFullYear()
  const day = date.getDate() + 1
  const month = date.getMonth() + 1
  return `${year}-${day}-${month}`
}

interface I_data {
  clLevel?: 'account' | 'campaign' | 'adset' | 'ad'
  clAdId: string | null
}

const accessToken =
  'EAARZAo3JNZBTIBOyG5Dcy0YXw5ZBzdg7srlek0dNMrahDZBGvQ60KXn4ZCUFLLLneJCN3KWyhwAzZCW0agT3FRiKqWaiWzKx366iQLZCIgXn2CuXNQCrx2U7ZBXta42EiBAyXyVCmrGaeJ2bvkn0wvtjnxGjhY0ZBZB5l5loqtZAFzfkOa65SfZA1MBqUU3sVITf55iLF5CZAoAZDZD'!
const appSecret = '67a182b4525202f51a6d6604bc5e7d66'!
const adAccountId = '3519590174999724'!

function generateAppSecretProof(token: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(token).digest('hex')
}

export const util_facebookInsights = async (data: I_data) => {
  const appsecret_proof = generateAppSecretProof(accessToken, appSecret)

  const untilDate = await getDate()
  const adId = data.clAdId || `act_${adAccountId}`

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${adId}/insights`,
      {
        params: {
          access_token: accessToken,
          appsecret_proof,
          level: data?.clLevel,
          fields:
            'impressions, clicks, spend, campaign_name, campaign_id, adset_name, ad_id, actions, action_values, ad_impression_actions, conversions, conversion_values, cost_per_unique_action_type', // Customize as needed
          time_range: JSON.stringify({
            since: '2024-03-01',
            until: untilDate,
          }),
          breakdowns: ['country'],
        },
      }
    )
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw err
  }
}
