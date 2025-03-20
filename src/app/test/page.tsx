import React from 'react'
import { supa_admin_createUserRole } from '../utilities/functions/adminFunctions/createUserRole'

const Testpage = async () => {
  await supa_admin_createUserRole('69d20062-5388-4530-9009-fd17afac07a8', 'authenticated')

  return <div></div>
}

export default Testpage
