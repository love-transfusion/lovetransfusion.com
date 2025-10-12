/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axios from 'axios'

type CityRow = {
  city: string
  reach: number
  impressions: number
  spend: number
}
type Result = {
  postId: string
  adIds: string[]
  timeRange: { since: string; until: string }
  rows: CityRow[]
  notes: string[]
}

export const getCityBreakdownByPost = async (opts: {
  postId: string // "PAGEID_POSTID" preferred
  pageId?: string
  since: string // "YYYY-MM-DD"
  until: string // "YYYY-MM-DD"
}): Promise<Result> => {
  const version = process.env.NEXT_PUBLIC_GRAPH_VERSION || 'v22.0'
  const BASE = `https://graph.facebook.com/${version}`

  // IMPORTANT: Use a **System User token** with ads_read + read_insights and access to the ad account
  const ACCESS_TOKEN = process.env.FACEBOOK_SYSTEM_TOKEN
  const AD_ACCOUNT_ID = 'act_3519590174999724' // keep as act_XXXX

  if (!ACCESS_TOKEN) throw new Error('FACEBOOK_SYSTEM_TOKEN is required')

  const notes: string[] = []
  const fullPostId = opts.postId.includes('_')
    ? opts.postId
    : `${opts.pageId}_${opts.postId}`

  if (!fullPostId)
    throw new Error('Provide postId as PAGEID_POSTID or include pageId.')

  // 1) Find ads whose creatives reference this post (effective_object_story_id === fullPostId)
  const adIds: string[] = []
  try {
    let nextUrl = `${BASE}/${AD_ACCOUNT_ID}/ads`
    let params: any = {
      access_token: ACCESS_TOKEN,
      limit: 200,
      fields: 'id,creative{effective_object_story_id}',
      // keep this as an array (Meta expects an array here)
      effective_status: [
        'ACTIVE',
        'PAUSED',
        'ARCHIVED',
        'IN_PROCESS',
        'WITH_ISSUES',
      ],
    }

    while (nextUrl) {
      const { data } = await axios.get(nextUrl, { params })
      const items: any[] = data?.data ?? []
      for (const ad of items) {
        const eosid = ad?.creative?.effective_object_story_id
        if (eosid === fullPostId) adIds.push(ad.id)
      }
      nextUrl = data?.paging?.next ?? ''
      params = undefined // paging.next already encodes everything needed
    }
  } catch (e: any) {
    const msg = e?.response?.data?.error?.message || e?.message
    throw new Error(`Failed to list ads: ${msg}`)
  }

  if (adIds.length === 0) {
    notes.push(
      `No ads found that promote post ${fullPostId}. Ensure the post was boosted/used in an ad creative (effective_object_story_id).`
    )
    return {
      postId: fullPostId,
      adIds,
      timeRange: { since: opts.since, until: opts.until },
      rows: [],
      notes,
    }
  }

  // 2) Get insights with breakdowns=city per ad, aggregate
  const cityAgg = new Map<string, CityRow>()

  for (const adId of adIds) {
    try {
      const { data } = await axios.get(`${BASE}/${adId}/insights`, {
        params: {
          access_token: ACCESS_TOKEN,
          fields: 'reach,impressions,spend',
          breakdowns: 'city',
          level: 'ad', // be explicit
          'time_range[since]': opts.since, // <- safer encoding vs JSON string
          'time_range[until]': opts.until,
          limit: 5000,
        },
      })

      const rows: any[] = data?.data ?? []
      for (const r of rows) {
        const key = r.city || 'Unknown'
        const prev = cityAgg.get(key) || {
          city: key,
          reach: 0,
          impressions: 0,
          spend: 0,
        }
        cityAgg.set(key, {
          city: key,
          reach: prev.reach + Number(r.reach || 0),
          impressions: prev.impressions + Number(r.impressions || 0),
          spend: prev.spend + Number(r.spend || 0),
        })
      }
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message || e?.message
      // Don’t crash the whole run—note the error and continue
      notes.push(`Insights failed for ad ${adId}: ${msg}`)
    }
  }

  const rows = Array.from(cityAgg.values()).sort(
    (a, b) => b.reach - a.reach || b.impressions - a.impressions
  )

  return {
    postId: fullPostId,
    adIds,
    timeRange: { since: opts.since, until: opts.until },
    rows,
    notes,
  }
}
