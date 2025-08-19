'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from 'axios'
import fuzzysort from 'fuzzysort'

// Types for handling Facebook API responses
export interface FacebookAdAccount {
  id: string
  name: string
}

interface FacebookApiError {
  message: string
  type: string
  code: number
  error_subcode?: number
  fbtrace_id?: string
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
  cl_country: string
  cl_country_code: string // Add country code for consistency
  cl_region: string
  cl_city: string
  cl_impressions: number
  cl_reach: number
  cl_like_reactions: number
  cl_heart_reactions: number
  cl_hug_reactions: number
  cl_total_reactions: number
}

export interface CampaignInsight {
  campaign_id: string
  campaign_name: string
  cl_country: string
  cl_region: string
  cl_city: string
  cl_impressions: number
  cl_reach: number
  cl_like_reactions: number
  cl_heart_reactions: number
  cl_hug_reactions: number
  cl_total_reactions: number
  objective?: string
  status?: string
  spendAmount?: number
  spendCurrency?: string
}

// Add AdSetInsight interface definition after the existing CampaignInsight interface
export interface AdSetInsight {
  adset_id: string
  adset_name: string
  campaign_id?: string
  campaign_name?: string
  cl_country: string
  cl_region: string
  cl_city: string
  cl_impressions: number
  cl_reach: number
  cl_like_reactions: number
  cl_heart_reactions: number
  cl_hug_reactions: number
  cl_total_reactions: number
  objective?: string
  status?: string
  spendAmount?: number
  spendCurrency?: string
}

// Update the AdInsight interface to use properties that align with FacebookInsight
export interface AdInsight {
  ad_id: string
  ad_name: string
  adset_id?: string
  adset_name?: string
  campaign_id?: string
  campaign_name?: string
  cl_country: string
  cl_country_code: string // Added country code
  cl_region: string
  cl_city: string
  cl_impressions: number
  cl_reach: number
  cl_like_reactions: number
  cl_heart_reactions: number
  cl_hug_reactions: number
  cl_total_reactions: number
}

// Interface for AdWise insights
export interface AdWiseInsight {
  ad_id: string
  ad_name: string
  adset_id?: string
  adset_name?: string
  campaign_id?: string
  campaign_name?: string
  cl_country: string
  cl_country_code: string // Added country code
  cl_region: string
  cl_city: string
  cl_impressions: number
  cl_reach: number
  cl_like_reactions: number
  cl_heart_reactions: number
  cl_hug_reactions: number
  cl_total_reactions: number
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
export const fetchAllPages = async <T>(url: string): Promise<T[]> => {
  const allData: T[] = []
  let nextUrl: string | null = url

  while (nextUrl) {
    try {
      const response: AxiosResponse<FacebookApiResponse<T>> = await axios.get(
        nextUrl
      )
      const responseData: FacebookApiResponse<T> = response.data
      const data: T[] = responseData.data
      const paging: FacebookPaging | undefined = responseData.paging

      allData.push(...data)
      nextUrl = paging?.next || ''
    } catch (err) {
      const error = err as AxiosError

      // if (error.response) {
      //   console.error('Status:', error.response.status)
      //   console.error('Data:', error.response.data)
      // } else if (error.request) {
      //   console.error('No response received:', error.request)
      // } else {
      //   console.error('Error message:', error.message)
      // }

      throw new Error(`Failed to fetch data at ${nextUrl}: ${error.message}`)
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function distributeReactionsByImpressions(
  locations: { [key: string]: any }[],
  total: number,
  key: string
) {
  const totalImpressions = locations.reduce((sum, l) => sum + l.impressions, 0)
  if (totalImpressions === 0) return locations.map((l) => ({ ...l, [key]: 0 }))
  // Step 1: Raw quotas
  const withRaw = locations.map((l) => ({
    ...l,
    raw: (l.impressions / totalImpressions) * total,
    base: 0,
    rem: 0,
  }))
  // Step 2: Floor allocation
  withRaw.forEach((l) => {
    l.base = Math.floor(l.raw)
    l.rem = l.raw - l.base
  })
  // Step 3: Distribute leftovers
  const allocated = withRaw.reduce((sum, l) => sum + l.base, 0)
  const leftover = total - allocated
  const sorted = [...withRaw].sort((a, b) => b.rem - a.rem)
  for (let i = 0; i < leftover; i++) {
    sorted[i % sorted.length].base++
  }
  // Step 4: Set final value, preserve all original properties
  return withRaw.map((l) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { raw, base, rem, ...rest } = l
    return { ...rest, [key]: l.base }
  })
}

// --- Ad Wise Insights ---
interface AdWiseLocation {
  ad_id: string
  ad_name: string
  adset_id: string
  adset_name: string
  campaign_id: string
  campaign_name: string
  cl_country: string
  cl_region: string
  cl_city: string
  impressions: number
  cl_impressions: number
  cl_reach: number
  cl_like_reactions?: number
  cl_heart_reactions?: number
  cl_hug_reactions?: number
}

// Helper to get city name (DMA or region)
function getCityName(
  region: string,
  ad_id: string,
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
        dma.ad_id === ad_id &&
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

// --- DMA to State Mapping (Standalone) ---
// (Partial, for brevity. In production, use the full mapping from adInsights.js)

function normalizeDMA(dma: string): string {
  return dma
    .replace(/\s*DMA$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .normalize('NFC')
}

function fuzzyFindDMA(dmaInput: string, candidates: string[]): string | null {
  if (!dmaInput || candidates.length === 0) return null
  const inputNorm = normalizeDMA(dmaInput)
  for (const key of candidates) {
    if (normalizeDMA(key) === inputNorm) return key
  }
  // Fuzzy match using fuzzysort
  const results = fuzzysort.go(inputNorm, candidates, { threshold: -1000 })
  if (results.length > 0) {
    return results[0].target
  }
  return null
}

type FetchAdWiseInsightsParams =
  | {
      /** If accountId is present, this should not be defined */
      ad_id: string
      accountId?: never
    }
  | {
      /** If ad_id is present, this should not be defined */
      accountId: string
      ad_id?: never
    }

// --- Ad Wise Insights ---
/**
 * ```
 * await util_fetchAdWiseInsights ({
      accountId || ad_id,
      apiVersion?,
      datePreset?,
  })
 * ```
  @returns AdWiseInsight[]
 */
export const util_fetchAdWiseInsights = async ({
  accountId,
  ad_id,
}: FetchAdWiseInsightsParams): Promise<{
  data: AdWiseInsight[] | []
  error: string | null
}> => {
  const apiVersion = 'v22.0'
  const datePreset = 'maximum'
  const token = process.env.FACEBOOK_SYSTEM_TOKEN!
  try {
    const formattedAccountId = accountId ? formatAccountId(accountId) : ad_id
    // 1. Fetch geo breakdown (country,region) - fetch all pages
    const geoUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const geoParams = {
      access_token: token,
      level: 'ad',
      fields:
        'ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,impressions,reach', // Only valid fields
      breakdowns: 'country,region', // Use as breakdowns, not fields
      date_preset: datePreset,
      limit: '1000',
    }
    const geoQueryString = new URLSearchParams(geoParams).toString()
    const geoInsights = await fetchAllPages<FacebookInsight>(
      `${geoUrl}?${geoQueryString}`
    )
    // 3. Fetch reactions (action_breakdowns=action_reaction, all pages)
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

    let like = 0,
      love = 0,
      care = 0
    for (const i of reactInsights) {
      for (const a of i.actions ?? []) {
        if (a.action_type === 'post_reaction' && a.action_reaction) {
          const v = parseInt(a.value, 10) || 0
          const r = a.action_reaction.toLowerCase()
          if (r === 'like') like += v
          else if (r === 'love') love += v
          else if (r === 'care' || r === 'hug') care += v
        }
      }
    }
    const adReactionsTotal = like + love + care
    console.log({ like, love, care, adReactionsTotal })

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
        // Facebook API v22: action_type can be 'post_reaction' and action_reaction is the type
        if (action.action_type === 'post_reaction' && action.action_reaction) {
          if (action.action_reaction === 'like')
            like += parseInt(action.value, 10) || 0
          else if (action.action_reaction === 'love')
            heart += parseInt(action.value, 10) || 0
          else if (
            action.action_reaction === 'care' ||
            action.action_reaction === 'hug'
          )
            hug += parseInt(action.value, 10) || 0
        } else if (
          action.action_type === 'like' ||
          action.action_type === 'post_reaction:like'
        )
          like += parseInt(action.value, 10) || 0
        else if (
          action.action_type === 'love' ||
          action.action_type === 'post_reaction:love'
        )
          heart += parseInt(action.value, 10) || 0
        else if (
          action.action_type === 'care' ||
          action.action_type === 'post_reaction:care' ||
          action.action_type === 'hug' ||
          action.action_type === 'post_reaction:hug'
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
    adMap.forEach((regions, ad_id) => {
      const reactions = adReactionsMap.get(ad_id) || {
        like: 0,
        heart: 0,
        hug: 0,
      }
      const locations: AdWiseLocation[] = regions
        .filter((i) => i.region && i.impressions)
        .map((insight) => {
          let cl_country = getCountryFullName(insight.country || 'Unknown')
          const cl_region = insight.region!
          const cl_city = insight.region!
          // --- US logic: use DMA as city, region as state, with fuzzy DMA matching ---
          if (
            insight.country &&
            ['US', 'USA', 'United States'].includes(insight.country)
          ) {
            cl_country = 'United States'
          }
          return {
            ad_id: insight.ad_id!,
            ad_name: insight.ad_name || '',
            adset_id: insight.adset_id || '',
            adset_name: insight.adset_name || '',
            campaign_id: insight.campaign_id || '',
            campaign_name: insight.campaign_name || '',
            cl_country,
            cl_country_code: insight.country || '', // Add country code to match interface
            cl_region,
            cl_city,
            impressions: parseInt(insight.impressions || '0', 10),
            cl_impressions: parseInt(insight.impressions || '0', 10),
            cl_reach: parseInt(insight.reach || '0', 10),
          }
        })
      const withLike = distributeReactionsByImpressionsTyped(
        locations,
        reactions.like,
        'cl_like_reactions'
      )
      const withHeart = distributeReactionsByImpressionsTyped(
        withLike,
        reactions.heart,
        'cl_heart_reactions'
      )
      const withHug = distributeReactionsByImpressionsTyped(
        withHeart,
        reactions.hug,
        'cl_hug_reactions'
      )
      withHug.forEach((l) => {
        results.push({
          ad_id: l.ad_id,
          ad_name: l.ad_name,
          adset_id: l.adset_id,
          adset_name: l.adset_name,
          campaign_id: l.campaign_id,
          campaign_name: l.campaign_name,
          cl_country: l.cl_country,
          cl_country_code:
            typeof l.cl_country_code === 'string'
              ? l.cl_country_code
              : String(l.cl_country_code ?? ''), // Ensure string type
          cl_region: l.cl_region,
          cl_city: l.cl_city,
          cl_impressions: l.cl_impressions,
          cl_reach: l.cl_reach,
          cl_like_reactions: l.cl_like_reactions ?? 0,
          cl_heart_reactions: l.cl_heart_reactions ?? 0,
          cl_hug_reactions: l.cl_hug_reactions ?? 0,
          cl_total_reactions:
            (l.cl_like_reactions ?? 0) +
            (l.cl_heart_reactions ?? 0) +
            (l.cl_hug_reactions ?? 0),
        })
      })
    })
    return { data: results, error: null }
  } catch (error: any) {
    const thisError = error?.message as string
    const specifyError =
      thisError === 'Request failed with status code 400'
        ? `We’re experiencing a brief technical issue. Support for you is still coming in, but some may not be visible in the meantime. This is only temporary while we work to restore the connection.`
        : thisError
    return { data: [], error: specifyError }
  }
}

export const util_multiple_fetchAdWiseInsights = async (
  ad_ids: string[] | undefined
) => {
  const customResult = ad_ids?.length
    ? await Promise.all(
        ad_ids.map(async (id) => {
          return await util_fetchAdWiseInsights({
            ad_id: id,
          })
        })
      )
    : [{ data: [], error: null }]

  return customResult.reduce(
    (a, b) => {
      if (!!!a.data?.length && !!!b.data?.length) {
        return { data: [], error: null }
      }
      return { data: [...a.data, ...b.data], error: a.error ?? b.error }
    },
    { data: [], error: null }
  )
}

// --- Account Wise Insights ---
interface AccountLocation {
  cl_country: string
  cl_country_code: string
  cl_region: string
  cl_city: string
  impressions: number
  cl_impressions: number
  cl_reach: number
  cl_like_reactions?: number
  cl_heart_reactions?: number
  cl_hug_reactions?: number
}

export const fetchAccountInsights = async (
  token: string,
  accountId: string,
  apiVersion: string,
  datePreset: string
): Promise<{ data: AccountInsight[] | null; error: string | null }> => {
  try {
    const formattedAccountId = formatAccountId(accountId)
    // 1. Fetch geo breakdown (region) - fetch all pages
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
    // 2. Fetch DMA data for US (all pages)
    let dmaInsights: FacebookInsight[] = []
    const usRegions = geoInsights.filter(
      (i) => i.country && ['US', 'USA', 'United States'].includes(i.country)
    )
    if (usRegions.length > 0) {
      const dmaUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
      const dmaParams = {
        access_token: token,
        level: 'account',
        fields: 'impressions,reach', // Only valid fields
        breakdowns: 'dma', // Use as breakdown, not field
        date_preset: datePreset,
        limit: '1000',
      }
      const dmaQueryString = new URLSearchParams(dmaParams).toString()
      try {
        const allDma = await fetchAllPages<FacebookInsight>(
          `${dmaUrl}?${dmaQueryString}`
        )
        dmaInsights = allDma.filter((dma) => dma.dma)
      } catch {}
    }
    // 3. Fetch reactions (action_breakdowns=action_reaction, all pages)
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
        totalReactions += sumTotalReactionsFromActions(insight.actions)
        for (const action of insight.actions) {
          if (
            action.action_type === 'post_reaction' &&
            action.action_reaction
          ) {
            if (action.action_reaction === 'like')
              totalLike += parseInt(action.value, 10) || 0
            else if (action.action_reaction === 'love')
              totalHeart += parseInt(action.value, 10) || 0
            else if (
              action.action_reaction === 'care' ||
              action.action_reaction === 'hug'
            )
              totalHug += parseInt(action.value, 10) || 0
          } else if (
            action.action_type === 'like' ||
            action.action_type === 'post_reaction:like'
          )
            totalLike += parseInt(action.value, 10) || 0
          else if (
            action.action_type === 'love' ||
            action.action_type === 'post_reaction:love'
          )
            totalHeart += parseInt(action.value, 10) || 0
          else if (
            action.action_type === 'care' ||
            action.action_type === 'post_reaction:care' ||
            action.action_type === 'hug' ||
            action.action_type === 'post_reaction:hug'
          )
            totalHug += parseInt(action.value, 10) || 0
        }
      }
    })
    // 5. Prepare locations
    const locations: AccountLocation[] = geoInsights
      .filter((i) => i.region && i.impressions)
      .map((insight) => {
        let city = insight.region ?? 'Unknown'
        // For US, try to fuzzy match DMA for city
        if (
          insight.country &&
          ['US', 'USA', 'United States'].includes(insight.country) &&
          dmaInsights.length > 0
        ) {
          const candidateNames = dmaInsights.map((d) => d.dma!)
          const fuzzyDma = fuzzyFindDMA(insight.region!, candidateNames)
          if (fuzzyDma) city = fuzzyDma
        }
        return {
          cl_country: getCountryFullName(insight.country || 'Unknown'),
          cl_country_code: insight.country || 'Unknown',
          cl_region: insight.region!,
          cl_city: city,
          impressions: parseInt(insight.impressions || '0', 10),
          cl_impressions: parseInt(insight.impressions || '0', 10),
          cl_reach: parseInt(insight.reach || '0', 10),
        }
      })
    const withLike = distributeReactionsByImpressionsTyped(
      locations,
      totalLike,
      'cl_like_reactions'
    )
    const withHeart = distributeReactionsByImpressionsTyped(
      withLike,
      totalHeart,
      'cl_heart_reactions'
    )
    const withHug = distributeReactionsByImpressionsTyped(
      withHeart,
      totalHug,
      'cl_hug_reactions'
    )
    const result = withHug.map((l) => ({
      cl_city: l.cl_city,
      cl_region: l.cl_region,
      cl_country: l.cl_country,
      cl_country_code: l.cl_country_code,
      cl_total_reactions:
        (l.cl_like_reactions ?? 0) +
        (l.cl_heart_reactions ?? 0) +
        (l.cl_hug_reactions ?? 0),
      cl_heart_reactions: l.cl_heart_reactions ?? 0,
      cl_hug_reactions: l.cl_hug_reactions ?? 0,
      cl_like_reactions: l.cl_like_reactions ?? 0,
      cl_impressions: l.cl_impressions,
      cl_reach: l.cl_reach,
    }))
    if (result.length > 0) (result[0] as any).totalReactions = totalReactions
    return { data: result, error: null }
  } catch (error: any) {
    const thisError = error?.message as string
    const specifyError =
      thisError === 'Request failed with status code 400'
        ? `We’re experiencing a brief technical issue. Support for you is still coming in, but some may not be visible in the meantime. This is only temporary while we work to restore the connection.`
        : thisError
    return { data: null, error: specifyError }
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

    // Second: Fetch ad insights with reaction data (without conflicting breakdowns)
    const reactionsUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const reactionsParams = {
      access_token: token,
      level: 'ad',
      fields:
        'ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,impressions,reach,actions',
      action_breakdowns: 'action_reaction',
      date_preset: datePreset,
      limit: '1000',
    }

    const reactionsQueryString = new URLSearchParams(reactionsParams).toString()
    const reactionsInsights = await fetchAllPages<FacebookInsight>(
      `${reactionsUrl}?${reactionsQueryString}`
    )

    // Fetch DMA data separately (still needed for US locations)
    const dmaUrl = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights`
    const dmaParams = {
      access_token: token,
      level: 'ad',
      fields:
        'ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,impressions,reach',
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (dmaError) {}

    // Create a map of reactions by ad_id
    const adReactionsMap = new Map<
      string,
      { likes: number; hearts: number; hugs: number }
    >()

    // Process reaction data from the separate reactions query
    reactionsInsights.forEach((insight) => {
      if (!insight.ad_id || !insight.actions) return

      const ad_id = insight.ad_id
      const reactions = adReactionsMap.get(ad_id) || {
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

      adReactionsMap.set(ad_id, reactions)
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

    adMap.forEach((fbInsights, ad_id) => {
      // Get reactions for this ad from our reactions map
      const reactions = adReactionsMap.get(ad_id) || {
        likes: 0,
        hearts: 0,
        hugs: 0,
      }

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
          ad_id: insight.ad_id!,
          ad_name: insight.ad_name!,
          adset_id: insight.adset_id,
          adset_name: insight.adset_name,
          campaign_id: insight.campaign_id,
          campaign_name: insight.campaign_name,
          cl_country: getCountryFullName(insight.country || 'Unknown'),
          cl_country_code: insight.country || 'Unknown',
          cl_region: insight.region!,
          cl_city: cityName,
          cl_impressions: loc.impressions,
          cl_reach: loc.reach,
          cl_like_reactions: loc.finalLike,
          cl_heart_reactions: loc.finalHeart,
          cl_hug_reactions: loc.finalHug,
          cl_total_reactions: loc.finalLike + loc.finalHeart + loc.finalHug,
        })
      })
    })

    // Sort by total reactions descending
    return results.sort((a, b) => b.cl_total_reactions - a.cl_total_reactions)
  } catch (error: any) {
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
