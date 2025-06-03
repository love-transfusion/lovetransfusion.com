/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect } from 'react'
import { I_supa_tooltips_with_user_tooltips } from './useTooltips'
import tooltipsStore from '@/app/utilities/store/tooltipsStore'
import { useStore } from 'zustand'
import { supa_select_tooltips } from '@/app/_actions/tooltips/actions'
import { supa_upsert_tooltips_user_status } from '@/app/_actions/tooltips_user_status/actions'
import { v4 } from 'uuid'

interface useToolTipFetchLazilyOrInsertTooltipsTypes {
  clPath: `/${string}`
}

const useToolTipFetchLazilyOrInsertTooltips = ({
  clPath,
}: useToolTipFetchLazilyOrInsertTooltipsTypes) => {
  const { dashboardTooltips, setdashboardTooltips } = useStore(tooltipsStore)

  const fetchTooltips = async () => {
    const { data }: { data: I_supa_tooltips_with_user_tooltips[] | null } =
      await supa_select_tooltips(clPath)

    if (data) {
      console.log({ data })
      const hasAll = data.every((item) => {
        return item.tooltips_user_status.length > 0
      })

      if (hasAll) {
        // When the user has the selected tooltip records
        setdashboardTooltips(data)
      } else {
        console.log('entered else')
        const rawUserTooltips = data.map((item) => {
          if (item.tooltips_user_status.length) {
            return { id: item.tooltips_user_status[0].id, tooltip_id: item.id }
          } else {
            return { id: v4(), tooltip_id: item.id }
          }
        })
        const { data: UserTooltipData, error } =
          await supa_upsert_tooltips_user_status(rawUserTooltips)
        console.log({ UserTooltipData, error })
        if (UserTooltipData) {
          const newData = data.map((item) => {
            const tooltips_user_status = [
              UserTooltipData.find(
                (itemuser) => itemuser.tooltip_id === item.id
              )!,
            ]
            return { ...item, tooltips_user_status }
          })
          setdashboardTooltips(newData)
          return
        }
        setdashboardTooltips(data)
      }
    }
  }
  useEffect(() => {
    if (!dashboardTooltips) {
      fetchTooltips()
    }
  }, [])
  return
}

export default useToolTipFetchLazilyOrInsertTooltips
