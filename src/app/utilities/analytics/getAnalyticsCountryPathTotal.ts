'use server'

export interface I_CountryPathTotalFormat {
  cl_region: string
  cl_country: string
  cl_country_code: string
  cl_city: string
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
        const cl_city =
          (row.dimensionValues && row.dimensionValues[1].value) ?? ''
        const cl_country_code =
          (row.dimensionValues && row.dimensionValues[4].value) ?? ''
        const cl_country =
          (row.dimensionValues && row.dimensionValues[3].value) ?? ''
        const cl_region =
          (row.dimensionValues && row.dimensionValues[2].value) ?? ''
        const clViews =
          (row.metricValues && parseInt(row.metricValues[0].value!)) ?? 0
        return {
          cl_city,
          cl_region,
          cl_country,
          cl_country_code,
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
        cl_city: item[0],
        cl_country: item[1][0]?.country ?? '(not set)',
        cl_country_code: item[1][0]?.country_code ?? '(not set)',
        cl_region: item[1][0]?.region ?? '(not set)',
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
