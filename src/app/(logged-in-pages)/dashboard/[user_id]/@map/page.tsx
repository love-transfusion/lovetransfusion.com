import React from 'react'
import { ga_selectGoogleAnalyticsData } from '@/app/utilities/analytics/googleAnalytics'
import getAnalyticsCountryPathTotal from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import { mapAnalyticsToGeoPoints } from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'
import MapChart from './MapChart'
import { supa_select_recipient } from '@/app/_actions/users_data_website/actions'

type Params = Promise<{ user_id: string }>

const MapSlot = async (props: { params: Params }) => {
  const { user_id } = await props.params
  const { data: recipientRow } = await supa_select_recipient(user_id)

  const unkRecipientObj = recipientRow?.recipient as unknown
  const recipientObj =
    unkRecipientObj as I_supaorg_recipient_hugs_counters_comments

  const clGoogleAnalytics = await ga_selectGoogleAnalyticsData({
    clSpecificPath: `/${recipientObj.path_url}`,
  })

  if (!recipientRow) return

  const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
    clGoogleAnalytics,
    clRecipient: recipientObj,
  })
  const mappedData =
    analyticsWithCountryPathTotal &&
    (await mapAnalyticsToGeoPoints(analyticsWithCountryPathTotal))
  return <>{<MapChart mappedData={mappedData} />}</>
}

export default MapSlot
