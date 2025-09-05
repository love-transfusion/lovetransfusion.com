import React from 'react'
import { selectandupdatefacebookposts } from './actions'

const TestPage = async () => {
  const { data } = await selectandupdatefacebookposts()
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default TestPage
