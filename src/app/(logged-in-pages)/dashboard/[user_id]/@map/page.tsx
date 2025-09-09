import React from 'react'
import MapChart from './MapChart'
import { supa_select_user } from '@/app/_actions/users/actions'
import MapTooltip from './MapTooltip'
import { ga_selectGoogleAnalyticsData } from '@/app/utilities/analytics/googleAnalytics'
import { AdWiseInsight } from '@/app/utilities/facebook/util_fb_insights'
import getAnalyticsCountryPathTotal from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'

type Params = Promise<{ user_id: string }>

const MapSlot = async ({ params }: { params: Params }) => {
  const { user_id } = await params
  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return null

  const unknown_selectedRecipient =
    selectedUser.recipients && (selectedUser.recipients[0].recipient as unknown)
  const selectedRecipient = unknown_selectedRecipient as I_supaorg_recipient

  const unknown_FBInsights = selectedUser.facebook_insights[0]
    .insights as unknown
  const FBInsights = unknown_FBInsights as AdWiseInsight[]

  const [clGoogleAnalytics] = await Promise.all([
    ga_selectGoogleAnalyticsData({
      clSpecificPath: `/${selectedRecipient.path_url}`,
    }),
  ])
  
  const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
    clGoogleAnalytics,
    clRecipient: selectedRecipient,
  })

  return (
    <div className="relative">
      <MapChart
        user_id={selectedUser.id}
        facebookAdData={FBInsights}
        analyticsWithCountryPathTotal={analyticsWithCountryPathTotal}
      />
      <MapTooltip user_id={user_id} />
    </div>
  )
}

export default MapSlot
