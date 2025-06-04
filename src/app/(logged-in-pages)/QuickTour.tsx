'use client'
import Image from 'next/image'
import React from 'react'
import { supa_select_tooltips } from '../_actions/tooltips/actions'
import questionMark from './images/FAQ.svg'
import { updateAllUserTooltipsFunction } from '../hooks/this-website-only/useTooltips'
import { useStore } from 'zustand'
import tooltipsStore from '../utilities/store/tooltipsStore'

interface QuickTourTypes {
  clToggleDrawer?: (bool?: boolean | undefined) => void
}

const QuickTour = ({ clToggleDrawer }: QuickTourTypes) => {
  const { setdashboardTooltips } = useStore(tooltipsStore)
  const handleQuickTour = async () => {
    const { data: dashboardTooltips, error } = await supa_select_tooltips(
      '/dashboard'
    )
    if (!dashboardTooltips || error) return

    const newdashboardTooltips =
      dashboardTooltips.map((item) => {
        return {
          ...item,
          tooltips_user_status: item.tooltips_user_status.length
            ? [
                {
                  ...item.tooltips_user_status[0],
                  dismissed: false,
                  dismissed_at: null,
                  seen: false,
                  seen_at: null,
                },
              ]
            : [],
        }
      }) ?? []

    if (clToggleDrawer) {
      clToggleDrawer(false)
    }
    setdashboardTooltips(newdashboardTooltips)

    await updateAllUserTooltipsFunction(newdashboardTooltips)
  }

  return (
    <div
      className={
        'flex gap-5 items-center text-xl font-acumin-variable-90 cursor-pointer'
      }
      onClick={handleQuickTour}
    >
      <Image
        src={questionMark}
        alt="heart"
        quality={100}
        className="size-[28px]"
      />
      <p className={'-mt-[1px]'}>Quick Tour</p>
    </div>
  )
}

export default QuickTour
