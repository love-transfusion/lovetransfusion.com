'use client'
import Icon_search from '@/app/components/icons/Icon_search'
import Input from '@/app/components/inputs/basic-input/Input'
import React, { useState } from 'react'
import { supa_admin_search_recipient } from './actions'
import Icon_spinner from '@/app/components/icons/Icon_spinner'

const SearchInput = () => {
  const [isSubmitting, setisSubmitting] = useState<boolean>(false)
  const [searchKeyword, setsearchKeyword] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setisSubmitting(true)
    setsearchKeyword(e.target.value)
    setisSubmitting(false)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !searchKeyword) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supa_admin_search_recipient(searchKeyword)
    setsearchKeyword('')
  }
  return (
    <div className="flex gap-2 items-center">
      {isSubmitting && <Icon_spinner className="text-primary animate-spin" />}
      <Input
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        clPlaceholder="Search..."
        clVariant="input2"
        clLeftIcon={<Icon_search />}
        clIconClassName="text-neutral-400"
        className="shadow-inner"
      />
    </div>
  )
}

export default SearchInput
