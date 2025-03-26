'use server'

export interface I_CountryPathTotalFormat {
  clRegion: string
  clCountry: string
  clCountryCode: string
  clCity: string
  clViews: number
  clMessages: number
  clHugs: number
}

type I_getAnalyticsCountryPathTotal = {
  clGoogleAnalytics: I_AnalyticsData
  clRecipient: I_supaorg_recipient_hugs_counters_comments
}

const getAnalyticsCountryPathTotal = async ({
  clGoogleAnalytics,
  clRecipient,
}: I_getAnalyticsCountryPathTotal) => {
  const analytics: I_CountryPathTotalFormat[] =
    (clGoogleAnalytics.rows &&
      clGoogleAnalytics.rows.map((row) => {
        const clCity =
          (row.dimensionValues && row.dimensionValues[1].value) ?? ''
        const clCountryCode =
          (row.dimensionValues && row.dimensionValues[4].value) ?? ''
        const clCountry =
          (row.dimensionValues && row.dimensionValues[3].value) ?? ''
        const clRegion =
          (row.dimensionValues && row.dimensionValues[2].value) ?? ''
        const clViews =
          (row.metricValues && parseInt(row.metricValues[0].value!)) ?? 0
        return {
          clCity,
          clRegion,
          clCountry,
          clCountryCode,
          clViews,
          clHugs: 0,
          clMessages: 0,
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
  }) => {
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
    const formattedArray = Object.entries(grouped).map((item) => {
      return {
        clCity: item[0],
        clCountry: item[1][0]?.country ?? '(not set)',
        clCountryCode: item[1][0]?.country_code ?? '(not set)',
        clRegion: item[1][0]?.region ?? '(not set)',
        clViews: 0,
        clMessages: isComments ? item[1].length : 0,
        clHugs: isHug ? item[1].length : 0,
      }
    })
    return formattedArray
  }

  const hugs = filterOrgLocationsAccordingToType({
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
