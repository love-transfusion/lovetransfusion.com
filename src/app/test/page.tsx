import React from 'react'
import { runParse } from '../lib/geonames/parseCities'

const Test = async () => {
  await runParse()
  return <div></div>
}

export default Test
