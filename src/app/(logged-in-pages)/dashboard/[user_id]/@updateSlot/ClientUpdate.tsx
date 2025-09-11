'use client'
import useToolTipFetchLazilyOrInsertTooltips from '@/app/hooks/this-website-only/useToolTipFetchLazilyOrInsertTooltips'
import { util_customRevalidatePath } from '@/app/utilities/util_customRevalidatePath'
import React, { useEffect } from 'react'

const ClientUpdate = () => {
  useToolTipFetchLazilyOrInsertTooltips({ clPath: '/dashboard' })

  const revalidate = async () => {
    await util_customRevalidatePath('/')
  }

  useEffect(() => {
    const interval = setInterval(revalidate, 2 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])
  return <div></div>
}

export default ClientUpdate
