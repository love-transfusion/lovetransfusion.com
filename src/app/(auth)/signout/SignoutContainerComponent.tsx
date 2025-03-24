'use client'
import React from 'react'
import { supa_signout } from './actions'

const SignoutContainerComponent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const handleSignout = async () => {
    await supa_signout()
  }
  return (
    <div onClick={handleSignout} className="cursor-pointer">
      {children}
    </div>
  )
}

export default SignoutContainerComponent
