'use server'

import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'
import { MapSource } from './mapAnalyticsToGeoPoints'

export interface I_CountryPathTotalFormat {
  cl_region: string
  cl_country: string
  cl_country_code: string
  cl_city: string
  clViews: number
  clMessages: number
  clHugs: number
  cl_source: MapSource
}

type I_getAnalyticsCountryPathTotal = {
  clGoogleAnalytics: I_AnalyticsData | undefined
  clRecipient: I_supaorg_recipient
}

const getAnalyticsCountryPathTotal = async ({
  clGoogleAnalytics,
  clRecipient,
}: I_getAnalyticsCountryPathTotal) => {
  const analytics: I_CountryPathTotalFormat[] =
    (clGoogleAnalytics &&
      clGoogleAnalytics.rows &&
      clGoogleAnalytics.rows.map((row) => {
        return {
          cl_city: (row.dimensionValues && row.dimensionValues[1].value) ?? '',
          cl_region:
            (row.dimensionValues && row.dimensionValues[2].value) ?? '',
          cl_country:
            (row.dimensionValues && row.dimensionValues[3].value) ?? '',
          cl_country_code:
            (row.dimensionValues && row.dimensionValues[4].value) ?? '',
          clViews:
            (row.metricValues && parseInt(row.metricValues[0].value!)) ?? 0,
          clHugs: 0,
          clMessages: 0,
          cl_source: 'Website',
        }
      })) ??
    []

  const filterOrgLocationsAccordingToType = ({
    isHug,
    isComments,
    locArray,
  }: {
    isHug?: boolean
    isComments?: boolean
    locArray: I_supaorg_hug[] | I_supaorg_comments[]
  }): I_CountryPathTotalFormat[] => {
    const grouped: { [city: string]: I_orgLocation[] } = {}

    locArray.forEach((locObj: I_supaorg_hug | I_supaorg_comments) => {
      const key = decodeURIComponent(locObj.location?.city ?? '(not set)')
      if (!grouped[key]) {
        grouped[key] = []
      }
      if (locObj.location) {
        grouped[key].push(locObj.location)
      }
    })
    return Object.entries(grouped).map((item) => {
      return {
        cl_city: item[0],
        cl_country: item[1][0]?.country ?? '(not set)',
        cl_country_code: item[1][0]?.country_code ?? '(not set)',
        cl_region: item[1][0]?.region ?? '(not set)',
        clViews: 0,
        clMessages: isComments ? item[1].length : 0,
        clHugs: isHug ? item[1].length : 0,
        cl_source: 'Website',
      }
    })
  }

  const hugs: I_CountryPathTotalFormat[] = filterOrgLocationsAccordingToType({
    isHug: true,
    locArray: clRecipient.hugs,
  })

  const comments = filterOrgLocationsAccordingToType({
    isComments: true,
    locArray: clRecipient.comments,
  })

  return [...analytics, ...hugs, ...comments]
}

export default getAnalyticsCountryPathTotal
