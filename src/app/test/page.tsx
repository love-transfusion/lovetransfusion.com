import React from 'react'
import { fb_fetchPostInsights } from './test-insights'

const TestPage = async () => {
  const insights = await fb_fetchPostInsights(
    '107794902571685_1195802485918393'
  )
  return <pre>{JSON.stringify(insights, null, 2)}</pre>
}

export default TestPage
