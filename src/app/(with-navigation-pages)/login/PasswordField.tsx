'use client'
import Icon_eyes from '@/app/components/icons/Icon_eyes'
import Icon_eyes2 from '@/app/components/icons/Icon_eyes2'
import Input from '@/app/components/inputs/basic-input/Input'
import { I_Auth_LoginRequiredData } from '@/types/auth.types'
import React, { useState } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'

interface I_PasswordField {
  clRegister: UseFormRegister<I_Auth_LoginRequiredData>
  errors: FieldErrors<I_Auth_LoginRequiredData>
}

const PasswordField = ({ clRegister, errors }: I_PasswordField) => {
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
      {...clRegister('password', {
        required: 'Password field is required',
      })}
      clErrorMessage={errors.password?.message}
      clIconClassName="right-3"
      className="pr-9"
    />
  )
}

export default PasswordField
