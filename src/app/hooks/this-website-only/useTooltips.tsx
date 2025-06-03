/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Button from '@/app/components/Button/Button'
import tooltipsStore from '@/app/utilities/store/tooltipsStore'
import { useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useStore } from 'zustand'
import useMenu2 from '../useMenu2'
import { util_scrollToSection } from '@/app/utilities/util_scrollToSection'
import { supa_upsert_tooltips_user_status } from '@/app/_actions/tooltips_user_status/actions'
import { util_formatDateToUTCString } from '@/app/utilities/date-and-time/util_formatDateToUTCString'

export interface I_supa_tooltips_with_user_tooltips
  extends I_supa_tooltips_row_unextended {
  tooltips_user_status: I_supa_tooltips_user_status_row_unextended[]
}
interface TooltipTypes {
  children: React.ReactNode
  clContainerClassName?: string
  clScrollTo_IDOrClass?: `#${string}` | `.${string}`
  clArrowStylesCustom?: string
}

interface useTooltipTypes {
  clTooltipTitle:
    | 'Engagements'
    | 'Awareness'
    | 'Controls'
    | 'Updates'
    | 'Supporters'
}

const useTooltip = ({ clTooltipTitle: tooltipTitile }: useTooltipTypes) => {
  const [hasNotDismissedTooltip, sethasNotDismissedTooltip] =
    useState<boolean>(false)
  const { dashboardTooltips, setdashboardTooltips } = useStore(tooltipsStore)

  const currentTooltip = useMemo(() => {
    return dashboardTooltips?.find((item) => item.title === tooltipTitile)
  }, [dashboardTooltips, tooltipTitile])

  const currentUserTooltip = currentTooltip?.tooltips_user_status[0]

  useEffect(() => {
  if (!dashboardTooltips || !currentTooltip || !currentTooltip.is_active) {
    sethasNotDismissedTooltip(false)
    return
  }

  const isTooltipUserStatusDismissed = !!currentUserTooltip?.dismissed

  const areTooltipsBeforeDismissed = dashboardTooltips.every((ttip) => {
    if (currentTooltip.order_index === 0) return true
    if (ttip.order_index < currentTooltip.order_index && ttip.is_active) {
      return !!ttip.tooltips_user_status[0]?.dismissed
    }
    return true
  })

  sethasNotDismissedTooltip(
    !isTooltipUserStatusDismissed && areTooltipsBeforeDismissed
  )
}, [dashboardTooltips, currentTooltip, currentUserTooltip])


  const updateFunction = async () => {
    if (currentUserTooltip) {
      const updatedUserTooltip = {
        ...currentUserTooltip,
        dismissed: true,
        dismissed_at: util_formatDateToUTCString(new Date()),
        seen: true,
        seen_at: util_formatDateToUTCString(new Date()),
      }

      const { data, error } = await supa_upsert_tooltips_user_status([
        updatedUserTooltip,
      ])
      console.log({ data, error })
    }
  }

  const updateAllFunction = async (
    newDashboardTooltips: I_supa_tooltips_with_user_tooltips[]
  ) => {
    const userTooltips = newDashboardTooltips.map((item) => {
      return item.tooltips_user_status[0]
    })
    await supa_upsert_tooltips_user_status(userTooltips)
  }

  const isLast = useMemo(() => {
    if (!dashboardTooltips) return false
    const activeCount = dashboardTooltips.reduce((count, item) => {
      const userStatus = item.tooltips_user_status[0]
      if (userStatus && !userStatus.dismissed) {
        return count + 1
      }
      return count
    }, 0)
    return activeCount === 1
  }, [dashboardTooltips])

  const Tooltip = ({
    clContainerClassName,
    children,
    clScrollTo_IDOrClass: clIDOrClass,
    clArrowStylesCustom,
  }: TooltipTypes) => {
    const { ClMenuContainer, clToggleMenu, Menu } = useMenu2(true)

    const handleNext = async () => {
      if (clIDOrClass) {
        util_scrollToSection({ clIDOrClass })
      }
      const newdashboardTooltips = dashboardTooltips?.map((item) => {
        if (item.title === tooltipTitile) {
          return {
            ...item,
            tooltips_user_status: item.tooltips_user_status.length
              ? [{ ...item.tooltips_user_status[0], dismissed: true }]
              : [],
          }
        } else {
          return item
        }
      })

      if (newdashboardTooltips) {
        setdashboardTooltips(newdashboardTooltips)
      }

      await updateFunction()
    }

    const handleSkipAll = async () => {
      const newdashboardTooltips =
        dashboardTooltips?.map((item) => {
          return {
            ...item,
            tooltips_user_status: item.tooltips_user_status.length
              ? [
                  {
                    ...item.tooltips_user_status[0],
                    dismissed: true,
                    dismissed_at: util_formatDateToUTCString(new Date()),
                    seen: true,
                    seen_at: util_formatDateToUTCString(new Date()),
                  },
                ]
              : [],
          }
        }) ?? []
      setdashboardTooltips(newdashboardTooltips)

      await updateAllFunction(newdashboardTooltips)
    }

    useEffect(() => {
      if (hasNotDismissedTooltip) {
        console.log('toggling', tooltipTitile, hasNotDismissedTooltip)
        clToggleMenu(true)
      }
    }, [hasNotDismissedTooltip])
    return (
      <div className={twMerge('', clContainerClassName)}>
        <ClMenuContainer>
          {children}
          {hasNotDismissedTooltip && (
            <Menu
              className="p-0 border border-primary overflow-hidden"
              clArrowStyles={`border border-primary bg-primary ${clArrowStylesCustom}`}
              mainContainerClassName="animate-slide-up"
            >
              <div className={'w-[320px] md:w-[400px] bg-primary'}>
                <div className={'min-h-[150px] bg-white p-3 pb-6'}>
                  <p className={'font-bold text-xl text-primary'}>
                    {
                      dashboardTooltips?.find(
                        (item) => item.title === tooltipTitile
                      )?.title
                    }
                  </p>
                  <p className={'mt-2'}>
                    {
                      dashboardTooltips?.find(
                        (item) => item.title === tooltipTitile
                      )?.content
                    }
                  </p>
                </div>
                <div
                  className={
                    'min-h-[60px] px-4 flex items-center justify-between'
                  }
                >
                  <Button
                    onClick={handleSkipAll}
                    className={`${
                      isLast ? 'opacity-0 pointer-events-none' : ''
                    }`}
                  >
                    Skip All
                  </Button>
                  <Button clTheme="light" onClick={handleNext}>
                    {`${isLast ? 'Close' : 'Next'}`}
                  </Button>
                </div>
              </div>
            </Menu>
          )}
        </ClMenuContainer>
      </div>
    )
  }

  return { Tooltip }
}

export default useTooltip
