'use server'
import { google, analyticsdata_v1beta } from 'googleapis'

interface I_googleAnalytics {
  clSpecificPath: string
}

export const ga_selectGoogleAnalyticsData = async ({
  clSpecificPath,
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
  let requestBody

  if (clSpecificPath) {
    requestBody = {
      dimensions: [{ name: 'pagePath' }, { name: 'country' }],
      metrics: [{ name: 'screenPageViews' }],
      dateRanges: [
        {
          startDate: '2022-01-01', // Replace with your actual earliest date or '2000-01-01'
          endDate: 'today',
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: clSpecificPath, // example: /benny
          },
        },
      },
    }
  } else {
    requestBody = {
      dimensions: [{ name: 'pagePath' }, { name: 'country' }],
      metrics: [{ name: 'screenPageViews' }],
      dateRanges: [
        {
          startDate: '2022-01-01', // Replace with your actual earliest date or '2000-01-01'
          endDate: 'today',
        },
      ],
    }
  }
  const response = await analyticsDataClient.properties.runReport({
    property: `properties/${process.env.GOOGLE_PROPERTY}`,
    requestBody: requestBody,
  })
  return response.data
}
