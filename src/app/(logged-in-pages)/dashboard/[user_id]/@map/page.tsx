import React from 'react'
import MapChart from './MapChart'
import { supa_select_recipient } from '@/app/_actions/users_data_website/actions'
import { supa_select_user } from '@/app/_actions/users/actions'
import MapTooltip from './MapTooltip'
import { ga_selectGoogleAnalyticsData } from '@/app/utilities/analytics/googleAnalytics'
import { util_multiple_fetchAdWiseInsights } from '@/app/utilities/facebook/util_facebookApi'
import getAnalyticsCountryPathTotal from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import { promises as fs } from 'fs'
import path from 'path'

type Params = Promise<{ user_id: string }>

const MapSlot = async ({ params }: { params: Params }) => {
  const { user_id } = await params

  const text = await fs.readFile(
    path.join(process.cwd(), 'public/maps/world.json'),
    'utf8'
  )
  const worldJson = JSON.parse(text)

  const [{ data: selectedUser }, { data: recipientRow }] = await Promise.all([
    supa_select_user(user_id),
    supa_select_recipient(user_id),
  ])

  if (!recipientRow) return null

  const recipientObj =
    recipientRow.recipient as I_supaorg_recipient_hugs_counters_comments

  const unknown_adIDs = selectedUser?.fb_ad_IDs as unknown
  const adIDs = unknown_adIDs as string[]

  const [clGoogleAnalytics, { data: facebookAdData }] = await Promise.all([
    ga_selectGoogleAnalyticsData({
      clSpecificPath: `/${recipientObj.path_url}`,
    }),
    util_multiple_fetchAdWiseInsights(adIDs),
  ])

  const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
    clGoogleAnalytics,
    clRecipient: recipientObj,
  })

  return (
    <div className="relative">
      <MapChart
        recipientObj={recipientObj}
        selectedUser={selectedUser}
        facebookAdData={facebookAdData}
        analyticsWithCountryPathTotal={analyticsWithCountryPathTotal}
        worldJson={worldJson}
      />
      <MapTooltip user_id={user_id} />
    </div>
  )
}

export default MapSlot
