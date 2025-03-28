'use client'
import Icon_eyes from '@/app/components/icons/Icon_eyes'
import Icon_eyes2 from '@/app/components/icons/Icon_eyes2'
import Input from '@/app/components/inputs/basic-input/Input'
import React, { useState } from 'react'
import {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from 'react-hook-form'

interface I_PasswordField<T extends FieldValues> {
  clRegister: UseFormRegister<T>
  errors?: FieldErrors<T>
  fieldName: Path<T> // 👈 Accepts 'password' or nested fields like 'user.password'
}

const PasswordField = <T extends FieldValues>({
  clRegister,
  errors,
  fieldName,
}: I_PasswordField<T>) => {
  const [isVisible, setIsVisible] = useState(false)
  const handleClick = () => setIsVisible((prev) => !prev)

  const fieldError = errors?.[fieldName] as { message?: string }

  return (
    <Input
      clPlaceholder="*****"
      type={isVisible ? 'text' : 'password'}
      id={fieldName}
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
      {...clRegister(fieldName, {
        required: 'Password field is required',
      })}
      clErrorMessage={fieldError?.message}
      clIconClassName="right-3"
      className="pr-9"
    />
  )
}

export default PasswordField
