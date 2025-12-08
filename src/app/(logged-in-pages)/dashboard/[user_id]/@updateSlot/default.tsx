import React from 'react'
import ClientUpdate from './ClientUpdate'
import { supa_select_user } from '@/app/_actions/users/actions'

type Params = Promise<{ user_id: string }>

const UpdateSlotDefault = async (props: { params: Params }) => {
  const { user_id } = await props.params

  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return
  return <ClientUpdate />
}

export default UpdateSlotDefault
