import React from 'react'
import MapChart from './MapChart'
import { supa_select_user } from '@/app/_actions/users/actions'
import MapTooltip from './MapTooltip'
import { ga_selectGoogleAnalyticsData } from '@/app/utilities/analytics/googleAnalytics'
import { util_multiple_fetchAdWiseInsights } from '@/app/utilities/facebook/util_fb_insights'
import getAnalyticsCountryPathTotal from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'

type Params = Promise<{ user_id: string }>

const MapSlot = async ({ params }: { params: Params }) => {
  const { user_id } = await params
  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return null

  const unknown_selectedRecipient = selectedUser.users_data_website[0]
    .recipient as unknown
  const selectedRecipient =
    unknown_selectedRecipient as I_supaorg_recipient_hugs_counters_comments

  const unknown_adIDs = selectedUser?.fb_ad_IDs as unknown
  const adIDs = unknown_adIDs as string[]

  const [clGoogleAnalytics, { data: facebookAdData }] = await Promise.all([
    ga_selectGoogleAnalyticsData({
      clSpecificPath: `/${selectedRecipient.path_url}`,
    }),
    util_multiple_fetchAdWiseInsights(adIDs),
  ])

  const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
    clGoogleAnalytics,
    clRecipient: selectedRecipient,
  })

  return (
    <div className="relative">
      <MapChart
        selectedUser={selectedUser}
        facebookAdData={facebookAdData}
        analyticsWithCountryPathTotal={analyticsWithCountryPathTotal}
      />
      <MapTooltip user_id={user_id} />
    </div>
  )
}

export default MapSlot
