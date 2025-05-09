/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

// Types for handling Facebook API responses
export interface FacebookAdAccount {
  id: string
  name: string
}

export interface FacebookApiError {
  message: string
  type: string
  code: number
  error_subcode?: number
  fbtrace_id: string
}

// Add GeoLocation interface for region data
export interface GeoLocation {
  key: string
  name: string
  type: string
  country_code: string
  country_name: string
  supports_city: boolean
  supports_region: boolean
  supports_country: boolean
  supports_address: boolean
}

// Data structures for formatted insights
export interface AccountInsight {
  clCountry: string
  clCountryCode: string
  clRegion: string
  clCity: string
  clImpressions: number
  clReach: number
  clLikeReactions: number
  clHeartReactions: number
  clHugReactions: number
  clTotalReactions: number
}

export interface CampaignInsight {
  campaignId: string
  campaignName: string
  clCountry: string
  clRegion: string
  clCity: string
  clImpressions: number
  clReach: number
  clLikeReactions: number
  clHeartReactions: number
  clHugReactions: number
  clTotalReactions: number
  objective?: string
  status?: string
  spendAmount?: number
  spendCurrency?: string
}

// Add AdSetInsight interface definition after the existing CampaignInsight interface
export interface AdSetInsight {
  adsetId: string
  adsetName: string
  campaignId?: string
  campaignName?: string
  clCountry: string
  clRegion: string
  clCity: string
  clImpressions: number
  clReach: number
  clLikeReactions: number
  clHeartReactions: number
  clHugReactions: number
  clTotalReactions: number
  objective?: string
  status?: string
  spendAmount?: number
  spendCurrency?: string
}

// Update the AdInsight interface to use properties that align with FacebookInsight
export interface AdInsight {
  adId: string
  adName: string
  adsetId?: string
  adsetName?: string
  campaignId?: string
  campaignName?: string
  clCountry: string
  clRegion: string
  clCity: string
  clImpressions: number
  clReach: number
  clLikeReactions: number
  clHeartReactions: number
  clHugReactions: number
  clTotalReactions: number
}

// Interface for AdWise insights
export interface AdWiseInsight {
  // adId: string
  // adName: string
  // adsetId?: string
  // adsetName?: string
  // campaignId?: string
  // campaignName?: string
  clCountry: string
  clRegion: string
  clCity: string
  clImpressions: number
  clReach: number
  clLikeReactions: number
  clHeartReactions: number
  clHugReactions: number
  clTotalReactions: number
  objective?: string
  status?: string
  spendAmount?: number
  spendCurrency?: string
}

// Facebook API responses
interface FacebookPaging {
  cursors: {
    before?: string
    after?: string
  }
  next?: string
}

interface FacebookApiResponse<T> {
  data: T[]
  paging?: FacebookPaging
  error?: FacebookApiError
}

interface FacebookAction {
  action_type: string
  value: string
  action_reaction?: string // Add this property for reaction breakdowns
}

interface FacebookInsight {
  impressions: string
  reach: string
  actions?: FacebookAction[]
  action_reactions?: {
    action_type: string
    value: string
  }[]
  action_reaction_action?: any[] // Added for older API versions
  // Updated to match current Facebook API structure
  reactions?: {
    like: number
    love: number
    care: number
    haha: number
    wow: number
    sad: number
    angry: number
  }
  country?: string
  region?: string
  dma?: string
  ad_id?: string
  ad_name?: string
  adset_id?: string
  adset_name?: string
  campaign_id?: string
  campaign_name?: string
  objective?: string // Added missing property
  spend?: string // Added missing property
  status?: string // Added for completeness
}

// Country code to full name mapping
const countryCodeToName: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  IN: 'India',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  IT: 'Italy',
  JP: 'Japan',
  BR: 'Brazil',
  RU: 'Russia',
  CN: 'China',
  ES: 'Spain',
  MX: 'Mexico',
  ZA: 'South Africa',
  SG: 'Singapore',
  AE: 'United Arab Emirates',
  NL: 'Netherlands',
  SE: 'Sweden',
  CH: 'Switzerland',
  PH: 'Philippines',
  BD: 'Bangladesh',
  MY: 'Malaysia',
  ID: 'Indonesia',
  TH: 'Thailand',
  VN: 'Vietnam',
  EG: 'Egypt',
  NG: 'Nigeria',
  KE: 'Kenya',
  SA: 'Saudi Arabia',
  TR: 'Turkey',
  // Add more country mappings as needed
}

// Function to convert country code to full name
const getCountryFullName = (countryCode: string): string => {
  if (!countryCode || countryCode === 'Unknown') return 'Unknown'
  return countryCodeToName[countryCode] || countryCode
}

// Fetch user's ad accounts after Facebook login
export const fetchAdAccounts = async (
  token: string,
  apiVersion: string
): Promise<FacebookAdAccount[]> => {
  try {
    const response = await axios.get<FacebookApiResponse<FacebookAdAccount>>(
      `https://graph.facebook.com/${apiVersion}/me/adaccounts`,
      {
        params: {
          access_token: token,
          fields: 'id,name',
        },
      }
    )
    return response.data.data
  } catch (error) {
    console.error('Error fetching ad accounts:', error)
    throw error
  }
}

// Helper function to handle paginated API results
const fetchAllPages = async <T>(url: string): Promise<T[]> => {
  let allData: T[] = []
  let nextUrl = url

  while (nextUrl) {
    try {
      const response = await axios.get<FacebookApiResponse<T>>(nextUrl)
      const { data, paging } = response.data

      allData = [...allData, ...data]
      nextUrl = paging?.next || ''
    } catch (error) {
      console.error('Error fetching paginated data:', error)
      throw error
    }
  }

  return allData
}

// Function to ensure account ID has the correct format
const formatAccountId = (accountId: string): string => {
  // Since we're now handling the act_ prefix on the frontend,
  // we just need to make sure the account ID has exactly one act_ prefix
  // This prevents issues if something goes wrong with the frontend handling
  if (!accountId.startsWith('act_')) {
    return `act_${accountId}`
  }
  return accountId
}

// Helper: Distribute reactions to locations by impressions share (Hamilton/Largest Remainder)
// function distributeReactionsByImpressions(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     locations: { [key: string]: any }[],
//     total: number,
//     key: string
// ) {
//     const totalImpressions = locations.reduce((sum, l) => sum + l.impressions, 0);
//     if (totalImpressions === 0) return locations.map(l => ({ ...l, [key]: 0 }));
//     // Step 1: Raw quotas
//     const withRaw = locations.map(l => ({ ...l, raw: (l.impressions / totalImpressions) * total, base: 0, rem: 0 }));
//     // Step 2: Floor allocation
//     withRaw.forEach(l => {
//         l.base = Math.floor(l.raw);
//         l.rem = l.raw - l.base;
//     });
//     // Step 3: Distribute leftovers
//     const allocated = withRaw.reduce((sum, l) => sum + l.base, 0);
//     let leftover = total - allocated;
//     const sorted = [...withRaw].sort((a, b) => b.rem - a.rem);
//     for (let i = 0; i < leftover; i++) {
//         sorted[i % sorted.length].base++;
//     }
//     // Step 4: Set final value, preserve all original properties
//     return withRaw.map(l => {
//         const { raw, base, rem, ...rest } = l;
//         return { ...rest, [key]: l.base };
//     });
// }

// --- Ad Wise Insights ---
/**
 * ```
 * interface AdWiseLocation {
    clCountry: string
    clRegion: string
    clCity: string
    // clTotalReactions: number
    clLikeReactions?: number
    clHeartReactions?: number
    clHugReactions?: number
    adId: string
    adName: string
    adsetId: string
    adsetName: string
    campaignId: string
    campaignName: string
    impressions: number
    clImpressions: number
    clReach: number
}
 * ```
 */
interface AdWiseLocation {
  clCountry: string
  clRegion: string
  clCity: string
  // clTotalReactions: number
  clLikeReactions?: number
  clHeartReactions?: number
  clHugReactions?: number
  adId: string
  adName: string
  adsetId: string
  adsetName: string
  campaignId: string
  campaignName: string
  impressions: number
  clImpressions: number
  clReach: number
}

// Helper to get city name (DMA or region)
function getCityName(
  region: string,
  adId: string,
  country: string,
  dmaInsights: Array<{
    ad_id: string
    region: string
    country: string
    dma?: string
  }>
): string {
  // Filter out any dmaInsights with undefined ad_id, region, or country
  const filteredDmaInsights = dmaInsights.filter(
    (dma) => dma.ad_id && dma.region && dma.country
  )
  if (
    (country === 'US' || country === 'USA' || country === 'United States') &&
    filteredDmaInsights.length > 0
  ) {
    const matchingDma = filteredDmaInsights.find(
      (dma) =>
        dma.ad_id === adId &&
        dma.region === region &&
        dma.country === country &&
        dma.dma &&
        dma.dma.trim() !== ''
    )
    if (matchingDma && matchingDma.dma) return matchingDma.dma
  }
  return region || 'Unknown'
}

function distributeReactionsByImpressionsTyped<T extends object>(
  locations: T[],
  total: number,
  key: string
): (T & { [k: string]: number })[] {
  const totalImpressions = locations.reduce(
    (sum, l: any) => sum + l.impressions,
    0
  )
  if (totalImpressions === 0) return locations.map((l) => ({ ...l, [key]: 0 }))
  const withRaw = locations.map((l) => ({
    ...l,
    raw: ((l as any).impressions / totalImpressions) * total,
    base: 0,
    rem: 0,
  }))
  withRaw.forEach((l) => {
    l.base = Math.floor(l.raw)
    l.rem = l.raw - l.base
  })
  const allocated = withRaw.reduce((sum, l) => sum + l.base, 0)
  const leftover = total - allocated
  const sorted = [...withRaw].sort((a, b) => b.rem - a.rem)
  for (let i = 0; i < leftover; i++) {
    sorted[i % sorted.length].base++
  }
  return withRaw.map((l) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { raw, base, rem, ...rest } = l
    return { ...rest, [key]: l.base } as T & { [k: string]: number }
  })
}

// Helper: Sum all post_reaction values for total reactions
function sumTotalReactionsFromActions(actions: FacebookAction[]): number {
  if (!actions) return 0
  // Sum all actions where action_type === 'post_reaction'
  return actions
    .filter((a) => a.action_type === 'post_reaction')
    .reduce((sum, a) => sum + (parseInt(a.value, 10) || 0), 0)
}

export const fetchAdWiseInsights = async (
  token: string,
  accountId: string,
  apiVersion: string,
  datePreset: string
): Promise<AdWiseInsight[]> => {
  try {
    const formattedAccountId = formatAccountId(accountId)
    // 1. Fetch geo breakdown (country,region)
    const geoUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const geoParams = {
      access_token: token,
      level: 'ad',
      fields:
        'ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,impressions,reach',
      breakdowns: 'country,region',
      date_preset: datePreset,
      limit: '1000',
    }
    const geoQueryString = new URLSearchParams(geoParams).toString()
    const geoInsights = await fetchAllPages<FacebookInsight>(
      `${geoUrl}?${geoQueryString}`
    )
    // 2. If US present, fetch DMA
    // let dmaInsights: FacebookInsight[] = []
    // if (
    //   geoInsights.some(
    //     (i) => i.country && ['US', 'USA', 'United States'].includes(i.country)
    //   )
    // ) {
    //   // Filter out any with undefined ad_id, region, or country before passing
    //   const dmaUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    //   const dmaParams = {
    //     access_token: token,
    //     level: 'ad',
    //     fields: 'ad_id,ad_name,impressions,reach,country,region',
    //     breakdowns: 'dma,country,region',
    //     date_preset: datePreset,
    //     limit: '1000',
    //   }
    //   const dmaQueryString = new URLSearchParams(dmaParams).toString()
    //   try {
    //     const allDma = await fetchAllPages<FacebookInsight>(
    //       `${dmaUrl}?${dmaQueryString}`
    //     )
    //     dmaInsights = allDma.filter(
    //       (dma) => dma.ad_id && dma.region && dma.country
    //     )
    //   } catch {}
    // }
    // 3. Fetch reactions (action_breakdowns=action_reaction)
    const reactUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const reactParams = {
      access_token: token,
      level: 'ad',
      fields: 'ad_id,actions',
      action_breakdowns: 'action_reaction',
      date_preset: datePreset,
      limit: '1000',
    }
    const reactQueryString = new URLSearchParams(reactParams).toString()
    const reactInsights = await fetchAllPages<FacebookInsight>(
      `${reactUrl}?${reactQueryString}`
    )
    // 4. Map reactions by ad_id
    const adReactionsMap = new Map<
      string,
      { like: number; heart: number; hug: number }
    >()
    reactInsights.forEach((insight) => {
      if (!insight.ad_id || !insight.actions) return
      let like = 0,
        heart = 0,
        hug = 0
      for (const action of insight.actions) {
        if (
          action.action_type === 'like' ||
          action.action_type === 'post_reaction:like' ||
          action.action_type === 'post_reaction'
        )
          like += parseInt(action.value, 10) || 0
        else if (
          action.action_type === 'love' ||
          action.action_type === 'post_reaction:love'
        )
          heart += parseInt(action.value, 10) || 0
        else if (
          action.action_type === 'care' ||
          action.action_type === 'post_reaction:care'
        )
          hug += parseInt(action.value, 10) || 0
      }
      adReactionsMap.set(insight.ad_id, { like, heart, hug })
    })
    // 5. Group geo insights by ad_id
    const adMap = new Map<string, FacebookInsight[]>()
    geoInsights.forEach((insight) => {
      if (!insight.ad_id) return
      const arr = adMap.get(insight.ad_id) || []
      arr.push(insight)
      adMap.set(insight.ad_id, arr)
    })
    const results: AdWiseInsight[] = []
    adMap.forEach((regions, adId) => {
      const reactions = adReactionsMap.get(adId) || {
        like: 0,
        heart: 0,
        hug: 0,
      }
      const locations: AdWiseLocation[] = regions
        .filter((i) => i.region && i.impressions)
        .map((insight) => {
          // const city = getCityName(
          //   insight.region ?? 'Unknown',
          //   insight.ad_id ?? 'Unknown',
          //   insight.country ?? 'Unknown',
          //   (Array.isArray(dmaInsights)
          //     ? dmaInsights.filter(
          //         (dma) =>
          //           typeof dma.ad_id === 'string' &&
          //           typeof dma.region === 'string' &&
          //           typeof dma.country === 'string'
          //       )
          //     : []) as {
          //     ad_id: string
          //     region: string
          //     country: string
          //     dma?: string
          //   }[]
          // )
          return {
            adId: insight.ad_id!,
            adName: insight.ad_name || '',
            adsetId: insight.adset_id || '',
            adsetName: insight.adset_name || '',
            campaignId: insight.campaign_id || '',
            campaignName: insight.campaign_name || '',
            clCountry: getCountryFullName(insight.country || 'Unknown'),
            clRegion: insight.region || 'Unknown',
            clCity: '(not set)',
            impressions: parseInt(insight.impressions || '0', 10),
            clImpressions: parseInt(insight.impressions || '0', 10),
            clReach: parseInt(insight.reach || '0', 10),
          }
        })
      const withLike = distributeReactionsByImpressionsTyped(
        locations,
        reactions.like,
        'clLikeReactions'
      )
      const withHeart = distributeReactionsByImpressionsTyped(
        withLike,
        reactions.heart,
        'clHeartReactions'
      )
      const withHug = distributeReactionsByImpressionsTyped(
        withHeart,
        reactions.hug,
        'clHugReactions'
      )
      withHug.forEach((l) => {
        results.push({
          clCountry: l.clCountry,
          clRegion: l.clRegion,
          clCity: l.clCity,
          clImpressions: l.clImpressions,
          clReach: l.clReach,
          clLikeReactions: l.clLikeReactions ?? 0,
          clHeartReactions: l.clHeartReactions ?? 0,
          clHugReactions: l.clHugReactions ?? 0,
          clTotalReactions:
            (l.clLikeReactions ?? 0) +
            (l.clHeartReactions ?? 0) +
            (l.clHugReactions ?? 0),
        })
      })
    })
    return results
  } catch (error) {
    console.error('Error fetching ad-wise insights:', error)
    throw error
  }
}

// --- Account Wise Insights ---
interface AccountLocation {
  clCountry: string
  clCountryCode: string
  clRegion: string
  clCity: string
  impressions: number
  clImpressions: number
  clReach: number
  clLikeReactions?: number
  clHeartReactions?: number
  clHugReactions?: number
}

export const fetchAccountInsights = async (
  token: string,
  accountId: string,
  apiVersion: string,
  datePreset: string
): Promise<AccountInsight[]> => {
  try {
    const formattedAccountId = formatAccountId(accountId)
    // 1. Fetch geo breakdown (region)
    const geoUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const geoParams = {
      access_token: token,
      level: 'account',
      fields: 'impressions,reach',
      breakdowns: 'region,country',
      date_preset: datePreset,
      limit: '1000',
    }
    const geoQueryString = new URLSearchParams(geoParams).toString()
    const geoInsights = await fetchAllPages<FacebookInsight>(
      `${geoUrl}?${geoQueryString}`
    )
    // 2. If US present, fetch DMA
    let dmaInsights: FacebookInsight[] = []
    if (
      geoInsights.some(
        (i) => i.country && ['US', 'USA', 'United States'].includes(i.country)
      )
    ) {
      const dmaUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
      const dmaParams = {
        access_token: token,
        level: 'account',
        fields: 'impressions,reach',
        breakdowns: 'dma',
        date_preset: datePreset,
        limit: '1000',
      }
      const dmaQueryString = new URLSearchParams(dmaParams).toString()
      try {
        const allDma = await fetchAllPages<FacebookInsight>(
          `${dmaUrl}?${dmaQueryString}`
        )
        dmaInsights = allDma.filter(
          (dma) => dma.ad_id && dma.region && dma.country
        )
      } catch {}
    }
    // 3. Fetch reactions (action_breakdowns=action_reaction)
    const reactUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const reactParams = {
      access_token: token,
      level: 'account',
      fields: 'actions',
      action_breakdowns: 'action_reaction',
      date_preset: datePreset,
      limit: '1000',
    }
    const reactQueryString = new URLSearchParams(reactParams).toString()
    const reactInsights = await fetchAllPages<FacebookInsight>(
      `${reactUrl}?${reactQueryString}`
    )
    // 4. Sum reactions
    let totalLike = 0,
      totalHeart = 0,
      totalHug = 0
    let totalReactions = 0
    reactInsights.forEach((insight) => {
      if (insight.actions) {
        // Sum all post_reaction values for true total
        totalReactions += sumTotalReactionsFromActions(insight.actions)
        for (const action of insight.actions) {
          if (
            (action.action_type === 'like' ||
              action.action_type === 'post_reaction:like' ||
              action.action_type === 'post_reaction') &&
            action.action_reaction === 'like'
          )
            totalLike += parseInt(action.value, 10) || 0
          else if (
            (action.action_type === 'love' ||
              action.action_type === 'post_reaction:love' ||
              action.action_type === 'post_reaction') &&
            action.action_reaction === 'love'
          )
            totalHeart += parseInt(action.value, 10) || 0
          else if (
            (action.action_type === 'care' ||
              action.action_type === 'post_reaction:care' ||
              action.action_type === 'post_reaction') &&
            action.action_reaction === 'care'
          )
            totalHug += parseInt(action.value, 10) || 0
        }
      }
    })
    // 5. Prepare locations
    const locations: AccountLocation[] = geoInsights
      .filter((i) => i.region && i.impressions)
      .map((insight) => {
        const city = getCityName(
          insight.region ?? 'Unknown',
          insight.ad_id ?? 'Unknown',
          insight.country ?? 'Unknown',
          (Array.isArray(dmaInsights)
            ? dmaInsights.filter(
                (dma) =>
                  typeof dma.ad_id === 'string' &&
                  typeof dma.region === 'string' &&
                  typeof dma.country === 'string'
              )
            : []) as {
            ad_id: string
            region: string
            country: string
            dma?: string
          }[]
        )
        return {
          clCountry: getCountryFullName(insight.country || 'Unknown'),
          clCountryCode: insight.country || 'Unknown',
          clRegion: insight.region!,
          clCity: city,
          impressions: parseInt(insight.impressions || '0', 10),
          clImpressions: parseInt(insight.impressions || '0', 10),
          clReach: parseInt(insight.reach || '0', 10),
        }
      })
    const withLike = distributeReactionsByImpressionsTyped(
      locations,
      totalLike,
      'clLikeReactions'
    )
    const withHeart = distributeReactionsByImpressionsTyped(
      withLike,
      totalHeart,
      'clHeartReactions'
    )
    const withHug = distributeReactionsByImpressionsTyped(
      withHeart,
      totalHug,
      'clHugReactions'
    )
    const result = withHug.map((l) => ({
      clCity: l.clCity,
      clRegion: l.clRegion,
      clCountry: l.clCountry,
      clCountryCode: l.clCountryCode,
      clTotalReactions:
        (l.clLikeReactions ?? 0) +
        (l.clHeartReactions ?? 0) +
        (l.clHugReactions ?? 0),
      clHeartReactions: l.clHeartReactions ?? 0,
      clHugReactions: l.clHugReactions ?? 0,
      clLikeReactions: l.clLikeReactions ?? 0,
      clImpressions: l.clImpressions,
      clReach: l.clReach,
    }))
    // Attach the true totalReactions to the first item for summary (use a type assertion)
    if (result.length > 0) (result[0] as any).totalReactions = totalReactions
    return result
  } catch (error) {
    console.error('Error fetching account insights:', error)
    throw error
  }
}

// Fetch ad-level insights
export const fetchAdInsights = async (
  token: string,
  accountId: string,
  apiVersion: string,
  datePreset: string
): Promise<AdInsight[]> => {
  try {
    const formattedAccountId = formatAccountId(accountId)

    // First: Fetch ad insights with geographic data (without action_breakdowns)
    const geoUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const geoParams = {
      access_token: token,
      level: 'ad',
      fields:
        'ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,impressions,reach',
      breakdowns: 'country,region',
      date_preset: datePreset,
      limit: '1000',
    }

    const geoQueryString = new URLSearchParams(geoParams).toString()
    const geoInsights = await fetchAllPages<FacebookInsight>(
      `${geoUrl}?${geoQueryString}`
    )

    // console.log('Ad geo insights fetched:', geoInsights.length)

    // Second: Fetch ad insights with reaction data (without conflicting breakdowns)
    const reactionsUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const reactionsParams = {
      access_token: token,
      level: 'ad',
      fields: 'ad_id,ad_name,actions',
      action_breakdowns: 'action_reaction',
      date_preset: datePreset,
      limit: '1000',
    }

    const reactionsQueryString = new URLSearchParams(reactionsParams).toString()
    const reactionsInsights = await fetchAllPages<FacebookInsight>(
      `${reactionsUrl}?${reactionsQueryString}`
    )

    // console.log('Ad reaction data fetched:', reactionsInsights.length)

    // Fetch DMA data separately (still needed for US locations)
    const dmaUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const dmaParams = {
      access_token: token,
      level: 'ad',
      fields: 'ad_id,ad_name,impressions,reach',
      breakdowns: 'dma',
      date_preset: datePreset,
      limit: '1000',
    }

    const dmaQueryString = new URLSearchParams(dmaParams).toString()
    let dmaInsights: FacebookInsight[] = []
    try {
      const allDma = await fetchAllPages<FacebookInsight>(
        `${dmaUrl}?${dmaQueryString}`
      )
      dmaInsights = allDma.filter(
        (dma) => dma.ad_id && dma.region && dma.country
      )
    } catch (dmaError) {
      console.warn(
        'Unable to fetch DMA data for ads, continuing without it:',
        dmaError
      )
    }

    // Create a map of reactions by ad_id
    const adReactionsMap = new Map<
      string,
      { likes: number; hearts: number; hugs: number }
    >()

    // Process reaction data from the separate reactions query
    reactionsInsights.forEach((insight) => {
      if (!insight.ad_id || !insight.actions) return

      const adId = insight.ad_id
      const reactions = adReactionsMap.get(adId) || {
        likes: 0,
        hearts: 0,
        hugs: 0,
      }

      insight.actions.forEach((action) => {
        // Check for all possible action_type values for reactions
        if (
          action.action_type === 'like' ||
          action.action_type === 'post_reaction:like' ||
          action.action_type === 'post_reaction'
        ) {
          reactions.likes += parseInt(action.value, 10) || 0
        } else if (
          action.action_type === 'love' ||
          action.action_type === 'post_reaction:love'
        ) {
          reactions.hearts += parseInt(action.value, 10) || 0
        } else if (
          action.action_type === 'care' ||
          action.action_type === 'post_reaction:care'
        ) {
          reactions.hugs += parseInt(action.value, 10) || 0
        }
      })

      adReactionsMap.set(adId, reactions)
    })

    // Group geo insights by ad_id
    const adMap = new Map<string, FacebookInsight[]>()
    geoInsights.forEach((insight: FacebookInsight) => {
      if (!insight.ad_id) return
      const existingInsights = adMap.get(insight.ad_id) || []
      adMap.set(insight.ad_id, [...existingInsights, insight])
    })

    // Process the insights and extract reaction data
    const results: AdInsight[] = []

    adMap.forEach((fbInsights, adId) => {
      // Get reactions for this ad from our reactions map
      const reactions = adReactionsMap.get(adId) || {
        likes: 0,
        hearts: 0,
        hugs: 0,
      }

      // console.log(
      //   `Ad ${adId} reactions - Likes: ${reactions.likes}, Hearts: ${reactions.hearts}, Hugs: ${reactions.hugs}`
      // )

      // Calculate total impressions for this ad across all regions
      const totalImpressions = fbInsights.reduce((sum, insight) => {
        return (
          sum + (insight.impressions ? parseInt(insight.impressions, 10) : 0)
        )
      }, 0)

      // For each region, prepare location data with impression information
      const locations = fbInsights
        .filter((insight) => insight.region) // Only process insights with region data
        .map((insight) => {
          const impressions = insight.impressions
            ? parseInt(insight.impressions, 10)
            : 0
          const reach = insight.reach ? parseInt(insight.reach, 10) : 0

          return {
            insight,
            impressions,
            reach,
            // Calculate raw quota for each type of reaction
            rawLike:
              totalImpressions > 0
                ? (impressions / totalImpressions) * reactions.likes
                : 0,
            rawHeart:
              totalImpressions > 0
                ? (impressions / totalImpressions) * reactions.hearts
                : 0,
            rawHug:
              totalImpressions > 0
                ? (impressions / totalImpressions) * reactions.hugs
                : 0,
            // Initialize base allocations
            baseLike: 0,
            baseHeart: 0,
            baseHug: 0,
            // Initialize remainders
            remLike: 0,
            remHeart: 0,
            remHug: 0,
            // Initialize final allocations
            finalLike: 0,
            finalHeart: 0,
            finalHug: 0,
          }
        })

      // Calculate base allocations (floor) and remainders
      locations.forEach((loc) => {
        loc.baseLike = Math.floor(loc.rawLike)
        loc.baseHeart = Math.floor(loc.rawHeart)
        loc.baseHug = Math.floor(loc.rawHug)

        loc.remLike = loc.rawLike - loc.baseLike
        loc.remHeart = loc.rawHeart - loc.baseHeart
        loc.remHug = loc.rawHug - loc.baseHug
      })

      // Calculate allocated and leftover reactions
      const allocatedLike = locations.reduce(
        (sum, loc) => sum + loc.baseLike,
        0
      )
      const allocatedHeart = locations.reduce(
        (sum, loc) => sum + loc.baseHeart,
        0
      )
      const allocatedHug = locations.reduce((sum, loc) => sum + loc.baseHug, 0)

      const leftoverLike = reactions.likes - allocatedLike
      const leftoverHeart = reactions.hearts - allocatedHeart
      const leftoverHug = reactions.hugs - allocatedHug

      // Distribute leftover reactions based on highest remainder
      // For likes
      const likeLocations = [...locations].sort((a, b) => b.remLike - a.remLike)
      for (let i = 0; i < leftoverLike && i < likeLocations.length; i++) {
        likeLocations[i].baseLike++
      }

      // For hearts
      const heartLocations = [...locations].sort(
        (a, b) => b.remHeart - a.remHeart
      )
      for (let i = 0; i < leftoverHeart && i < heartLocations.length; i++) {
        heartLocations[i].baseHeart++
      }

      // For hugs
      const hugLocations = [...locations].sort((a, b) => b.remHug - a.remHug)
      for (let i = 0; i < leftoverHug && i < hugLocations.length; i++) {
        hugLocations[i].baseHug++
      }

      // Set final allocations
      locations.forEach((loc) => {
        loc.finalLike = loc.baseLike
        loc.finalHeart = loc.baseHeart
        loc.finalHug = loc.baseHug
      })

      // For each location, create an ad insight entry
      locations.forEach((loc) => {
        const insight = loc.insight

        // Find DMA/city data if available
        const cityName = getCityName(
          insight.region ?? 'Unknown',
          insight.ad_id ?? 'Unknown',
          insight.country ?? 'Unknown',
          (Array.isArray(dmaInsights)
            ? dmaInsights.filter(
                (dma) =>
                  typeof dma.ad_id === 'string' &&
                  typeof dma.region === 'string' &&
                  typeof dma.country === 'string'
              )
            : []) as {
            ad_id: string
            region: string
            country: string
            dma?: string
          }[]
        ) // Default to region name

        // Create a new AdInsight object and add it to results array
        results.push({
          adId: insight.ad_id!,
          adName: insight.ad_name!,
          adsetId: insight.adset_id,
          adsetName: insight.adset_name,
          campaignId: insight.campaign_id,
          campaignName: insight.campaign_name,
          clCountry: getCountryFullName(insight.country || 'Unknown'),
          clRegion: insight.region!,
          clCity: cityName,
          clImpressions: loc.impressions,
          clReach: loc.reach,
          clLikeReactions: loc.finalLike,
          clHeartReactions: loc.finalHeart,
          clHugReactions: loc.finalHug,
          clTotalReactions: loc.finalLike + loc.finalHeart + loc.finalHug,
        })
      })
    })

    // Sort by total reactions descending
    return results.sort((a, b) => b.clTotalReactions - a.clTotalReactions)
  } catch (error: any) {
    console.error('Error fetching ad insights:', error)

    // Handle API-specific errors
    if (error.response) {
      const { status, data } = error.response

      if (status === 400) {
        if (data.error?.code === 190) {
          throw new Error(`Invalid access token: ${data.error.message}`)
        } else if (data.error?.code === 100) {
          throw new Error(
            `Facebook API error: ${data.error.message}. Try adjusting your query parameters.`
          )
        } else if (data.error?.message) {
          throw new Error(`Facebook API error: ${data.error.message}`)
        }
      } else if (status === 401) {
        throw new Error(
          'Authentication failed: The access token has expired or is invalid'
        )
      } else if (status === 403) {
        throw new Error(
          "Access denied: You don't have permission to access this ad account"
        )
      }
    }

    throw error
  }
}

// Function to fetch supported US regions for filter dropdown
export const fetchSupportedRegions = async (
  token: string,
  apiVersion: string,
  countryCode: string = 'US'
): Promise<GeoLocation[]> => {
  try {
    const url = `https://graph.facebook.com/${apiVersion}/search`
    const params = {
      access_token: token,
      type: 'adgeolocation',
      location_types: JSON.stringify(['region']),
      country_code: countryCode,
      limit: '1000',
    }

    const queryString = new URLSearchParams(params).toString()
    const response = await axios.get<FacebookApiResponse<GeoLocation>>(
      `${url}?${queryString}`
    )

    // Filter regions that are supported (supports_region: true)
    const supportedRegions = response.data.data.filter(
      (location) => location.supports_region === true
    )

    return supportedRegions
  } catch (error: any) {
    console.error('Error fetching supported regions:', error)

    // Add specific error handling for common Facebook API errors
    if (error.response) {
      const { status, data } = error.response

      if (status === 400 && data.error) {
        if (data.error?.code === 190) {
          throw new Error(`Invalid access token: ${data.error.message}`)
        } else if (data.error?.code === 100) {
          throw new Error(
            `Facebook API error: ${data.error.message}. Try adjusting your query parameters.`
          )
        } else if (data.error?.message) {
          throw new Error(`Facebook API error: ${data.error.message}`)
        }
      } else if (status === 401) {
        throw new Error(
          'Authentication failed: The access token has expired or is invalid'
        )
      } else if (status === 403) {
        throw new Error(
          "Access denied: You don't have permission to access this resource"
        )
      }
    }

    // If we couldn't identify a specific error, throw the original one
    throw error
  }
}
