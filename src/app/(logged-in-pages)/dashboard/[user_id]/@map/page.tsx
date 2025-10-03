import React from 'react'
import MapChart from './MapChart'
import { supa_select_user } from '@/app/_actions/users/actions'
import MapTooltip from './MapTooltip'
import getAnalyticsCountryPathTotal, {
  I_CountryPathTotalFormat,
} from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'
import { I_Region_Insight_Types } from '@/app/utilities/facebook/util_fb_reachByRegion_multiAds'

type Params = Promise<{ user_id: string }>

const preparePaidInsights = (
  facebookAdData?: I_Region_Insight_Types
): I_CountryPathTotalFormat[] => {
  return facebookAdData
    ? facebookAdData.rows.map((item) => {
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
        }
      })
    : []
}

const MapSlot = async (props: { params: Params }) => {
  const { user_id } = await props.params
  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return null

  const unknown_selectedRecipient =
    selectedUser.recipients && (selectedUser.recipients[0].recipient as unknown)
  const selectedRecipient = unknown_selectedRecipient as I_supaorg_recipient

  const FBInsights = !!selectedUser.facebook_insights2?.length
    ? (selectedUser.facebook_insights2[0]
        .insights as unknown as I_Region_Insight_Types)
    : undefined

  const analytics = selectedUser.google_analytics?.analytics as unknown as
    | I_AnalyticsData
    | undefined

  const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
    clGoogleAnalytics: analytics,
    clRecipient: selectedRecipient,
  })

  const paidInsights = preparePaidInsights(FBInsights)
  return (
    <div className="relative">
      <MapChart
        user_id={selectedUser.id}
        prepared_analytics={[...analyticsWithCountryPathTotal, ...paidInsights]}
      />
      <MapTooltip user_id={user_id} />
    </div>
  )
}

export default MapSlot
