'use client'
import React, { useEffect } from 'react'
import { util_getUUID } from '../utilities/util_getUUID'
import { useStore } from 'zustand'
import utilityStore from '../utilities/store/utilityStore'
import { supa_select_user } from '../_actions/users/actions'

const SetStore = () => {
  const { setuserInStore } = useStore(utilityStore)

  const findUUID = async () => {
    const user_id = await util_getUUID(window.location.href)
    if (!user_id) return
    const { data: clRecipientObj } = await supa_select_user(user_id)
    setuserInStore({
      id: clRecipientObj?.id ?? '',
      first_name: clRecipientObj?.recipient_name ?? '',
      parent_name: clRecipientObj?.parent_name ?? '',
      recipient_id: clRecipientObj?.recipient_id ?? '',
    })
  }
  useEffect(() => {
    if (window.location.href) {
      findUUID()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div></div>
}

export default SetStore
