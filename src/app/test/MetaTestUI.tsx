/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { sa_debug_page_token, sa_test_reactions_for_post } from './actions'

export default function MetaTestUI() {
  const [postId, setPostId] = useState('')
  const [out, setOut] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runToken = async () => {
    setLoading(true)
    try {
      setOut(await sa_debug_page_token())
    } finally {
      setLoading(false)
    }
  }

  const runPost = async () => {
    setLoading(true)
    try {
      setOut(await sa_test_reactions_for_post({ postId }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          onClick={runToken}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        >
          Debug PAGE token (/me)
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Post ID to test</label>
        <input
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="107794902571685_..."
        />
        <div className="mt-3">
          <button
            onClick={runPost}
            disabled={loading || !postId}
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
          >
            Test reactions for post
          </button>
        </div>
      </div>

      <pre className="bg-gray-100 rounded-md p-4 overflow-auto text-xs">
        {out ? JSON.stringify(out, null, 2) : 'No output yet'}
      </pre>
    </div>
  )
}
