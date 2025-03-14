'use client'
import Icon_eyes from '@/app/components/icons/Icon_eyes'
import Icon_eyes2 from '@/app/components/icons/Icon_eyes2'
import Input from '@/app/components/inputs/basic-input/Input'
import React, { useState } from 'react'

const PasswordField = () => {
  const [isVisible, setisVisible] = useState<boolean>(false)

  const handleClick = () => {
    setisVisible((prev) => !prev)
  }
  return (
    <Input
      clPlaceholder="*****"
      type={isVisible ? 'text' : 'password'}
      id="password"
      clRightIcon={
        isVisible ? (
          <Icon_eyes
            className="size-4 select-none cursor-pointer"
            onClick={handleClick}
          />
        ) : (
          <Icon_eyes2
            className="size-4 select-none cursor-pointer"
            onClick={handleClick}
          />
        )
      }
      clIconClassName="right-3"
      className="pr-9"
    />
  )
}

export default PasswordField
