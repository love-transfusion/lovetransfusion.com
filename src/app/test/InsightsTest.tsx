/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { sa_run_insights_route } from './actions'

export default function InsightsTestUI() {
  const [out, setOut] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    try {
      // Works for local dev. In prod, you can hardcode your site origin if needed.
      const origin = window.location.origin
      const res = await sa_run_insights_route({ origin })
      setOut(res)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        >
          {loading ? 'Running…' : 'Run /api/cron/insights'}
        </button>

        <button
          onClick={() => setOut(null)}
          className="px-4 py-2 rounded-md border"
        >
          Clear
        </button>
      </div>

      <pre className="bg-gray-100 rounded-md p-4 overflow-auto text-xs">
        {out ? JSON.stringify(out, null, 2) : 'No output yet'}
      </pre>
    </div>
  )
}
