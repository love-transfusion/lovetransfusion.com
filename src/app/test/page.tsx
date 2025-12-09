import React from 'react'
import { supa_select_orgRecipients } from '../_actions/orgRecipients/actions'

const Testpage = async () => {
  const { data, error } = await supa_select_orgRecipients('jazzy')
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  )
}

export default Testpage
