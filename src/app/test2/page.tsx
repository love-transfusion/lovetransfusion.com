'use client'
import React from 'react'
import useMenu2 from '../hooks/useMenu2'
import Button from '../components/Button/Button'

const Test2 = () => {
  const { Menu, clToggleMenu, ClMenuContainer } = useMenu2()
  // useEffect(() => {
  //   clToggleMenu()
  // }, [])
  return (
    <div className={'flex h-[200vh] items-center'}>
      <ClMenuContainer className="bg-red-100 ml-10">
        <Button onClick={() => clToggleMenu()}>0</Button>
        <Menu>
          <div className="text-nowrap w-[320px]">Dropdown Content</div>
        </Menu>
      </ClMenuContainer>
    </div>
  )
}

export default Test2
