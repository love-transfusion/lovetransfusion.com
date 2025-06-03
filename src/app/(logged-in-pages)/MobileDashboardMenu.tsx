'use client'
import React, { useEffect } from 'react'
import Icon_menu from '../components/icons/Icon_menu'
import useDrawer from '../hooks/useDrawer'
import { MenuTopPart } from '../components/this-website-only/navigation-menu/MobilePublicNavigation'
import SubMenu from './SubMenu'
import SubMenuBottom from './SubMenuBottom'
import { usePathname } from 'next/navigation'
interface I_MobileDashboardMenu {
  clIsAdmin: boolean
}
const MobileDashboardMenu = ({ clIsAdmin }: I_MobileDashboardMenu) => {
  const { clIsOpen, clToggleDrawer, Drawer } = useDrawer()

  const path = usePathname()

  useEffect(() => {
    if (clIsOpen) {
      clToggleDrawer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])
  return (
    <>
      <Icon_menu
        className="size-6 text-white 2xl:hidden cursor-pointer"
        onClick={() => clToggleDrawer()}
      />
      <Drawer
        clIsOpen={clIsOpen}
        clToggleDrawer={clToggleDrawer}
        clMoveLeftToRight
        clStyle={{
          background:
            'linear-gradient(rgb(47, 142, 221) 0%, rgb(47, 157, 221) 33%, rgb(47, 171, 221) 69%, rgb(47, 186, 221) 97%)',
        }}
        clWidth={{ bigScreens: '50%', sm: '80%' }}
        className="text-white px-9"
      >
        <MenuTopPart />
        <SubMenu clIsAdmin={clIsAdmin} />
        <SubMenuBottom clToggleDrawer={clToggleDrawer} />
      </Drawer>
    </>
  )
}

export default MobileDashboardMenu
