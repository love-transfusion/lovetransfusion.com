'use server'
import { google, analyticsdata_v1beta } from 'googleapis'

interface I_googleAnalytics {
  // pass ['/mary'] or ['/mary', '/c/mary']
  paths?: string[]
}

export const ga_selectGoogleAnalyticsData = async ({
  paths,
}: I_googleAnalytics) => {
  const ga_googleAuth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authClient = (await ga_googleAuth.getClient()) as any

  const analyticsDataClient = google.analyticsdata({
    version: 'v1beta',
    auth: authClient,
  }) as analyticsdata_v1beta.Analyticsdata

  // 🔹 Base request: SAME dimensions & metrics always
  const baseRequest: analyticsdata_v1beta.Schema$RunReportRequest = {
    dimensions: [
      { name: 'pagePath' },
      { name: 'city' },
      { name: 'region' },
      { name: 'country' },
      { name: 'countryId' },
    ],
    metrics: [{ name: 'screenPageViews' }],
    dateRanges: [
      {
        startDate: '2022-01-01',
        endDate: 'today',
      },
    ],
  }

  let requestBody: analyticsdata_v1beta.Schema$RunReportRequest

  if (paths && paths.length > 0) {
    // 🔹 One request that can handle 1 or many paths
    requestBody = {
      ...baseRequest,
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          inListFilter: {
            values: paths,
            caseSensitive: false,
          },
        },
      },
    }
  } else {
    // Fallback: no path filter (all pages)
    requestBody = baseRequest
  }

  const response = await analyticsDataClient.properties.runReport({
    property: `properties/${process.env.GOOGLE_PROPERTY}`,
    requestBody,
  })
  return response.data
}
