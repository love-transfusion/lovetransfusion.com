import React from 'react'
import MapChart from './MapChart'
import { supa_select_user } from '@/app/_actions/users/actions'
import MapTooltip from './MapTooltip'
import getAnalyticsCountryPathTotal, {
  I_CountryPathTotalFormat,
} from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'
import { RegionInsightByDate } from '@/app/utilities/facebook/util_fb_reachByRegion_multiAds'
import { mergeRowsByRegion } from './helper'

type Params = Promise<{ user_id: string }>

const preparedFacebookInsights = (
  facebookAdData?: RegionInsightByDate
): I_CountryPathTotalFormat[] => {
  const rows = facebookAdData ? mergeRowsByRegion(facebookAdData) : []
  return !!rows.length
    ? rows.map((item) => {
        const { cl_reach, cl_region, cl_impressions } = item
        return {
          cl_region,
          clViews: cl_reach,
          cl_impressions,
          cl_city: '',
          cl_country: '',
          cl_country_code: item.cl_country_code,
          clHugs: 0, // make this dynamic if needed
          clMessages: 0, // make this dynamic if needed
          cl_source: 'Facebook',
        }
      })
    : []
}

const MapSlotDefault = async (props: { params: Params }) => {
  const { user_id } = await props.params
  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return null

  const unknown_selectedRecipient =
    selectedUser.recipients && (selectedUser.recipients[0].recipient as unknown)
  const selectedRecipient = unknown_selectedRecipient as I_supaorg_recipient

  console.log({
    selectedRecipientTemplate: selectedRecipient.recipient_template,
  })

  const FBInsights = !!selectedUser.facebook_insights?.length
    ? (selectedUser.facebook_insights[0]
        .insights as unknown as RegionInsightByDate)
    : undefined

  const analytics = selectedUser.google_analytics?.analytics as unknown as
    | I_AnalyticsData
    | undefined

  const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
    clGoogleAnalytics: analytics,
    clRecipient: selectedRecipient,
  })

  const paidInsights = preparedFacebookInsights(FBInsights)
  return (
    <div className="relative">
      <MapChart
        user_id={selectedUser.id}
        recipient_template={selectedRecipient.recipient_template}
        prepared_analytics={[...analyticsWithCountryPathTotal, ...paidInsights]}
      />
      <MapTooltip user_id={user_id} />
    </div>
  )
}

export default MapSlotDefault
