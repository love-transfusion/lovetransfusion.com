import React from 'react'
import { supa_select_orgRecipients } from '../_actions/orgRecipients/actions'

const page = async () => {
const recipients = await supa_select_orgRecipients()
  return (
    <div>
      <pre>{JSON.stringify(recipients, null, 2)}</pre>
    </div>
  )
}

export default page
