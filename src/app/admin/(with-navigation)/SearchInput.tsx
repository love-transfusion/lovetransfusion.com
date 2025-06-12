'use client'
import Icon_search from '@/app/components/icons/Icon_search'
import Input from '@/app/components/inputs/basic-input/Input'
import React, { useState } from 'react'
import Icon_spinner from '@/app/components/icons/Icon_spinner'
import { supa_admin_search_recipient } from '@/app/_actions/admin/actions'
// import useMenu_Fixed from '@/app/hooks/useMenu_Fixed'
import Link from 'next/link'
import Icon_edit from '@/app/components/icons/Icon_edit'
import Icon_eyes from '@/app/components/icons/Icon_eyes'
import Icon_refresh from '@/app/components/icons/Icon_refresh'
import useMenu_Absolute from '@/app/hooks/useMenu_Absolute'

const SearchInput = () => {
  const [searchResults, setsearchResults] = useState<
    I_supa_users_data_website_row[] | null
  >(null)
  const [isSubmitting, setisSubmitting] = useState<boolean>(false)
  const [searchKeyword, setsearchKeyword] = useState<string>('')
  // const { clToggleMenu, clIsOpen, clRef, Menu } = useMenu_Fixed()
  const { clIsOpen, clToggleMenu, ClMenuContainer, Menu } = useMenu_Absolute()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchKeyword(e.target.value)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !searchKeyword) return
    setisSubmitting(true)
    const { data } = await supa_admin_search_recipient(searchKeyword)
    setsearchResults(data)
    setisSubmitting(false)
    if (!clIsOpen) {
      clToggleMenu()
    }
  }
  return (
    <div className="flex gap-2 items-center">
      <ClMenuContainer>
        <Input
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          clPlaceholder="Search..."
          clVariant="input2"
          clLeftIcon={
            isSubmitting ? (
              <Icon_spinner className="text-primary animate-spin w-5 h-5" />
            ) : (
              <Icon_search />
            )
          }
          clIconClassName="text-neutral-400"
          className="shadow-inner pl-7"
          // ref={clRef as React.RefObject<HTMLInputElement | null>}
        />
        <Menu className="shadow-md">
          <div className="min-w-[280px] md:min-w-[340px] max-w-[300px] md:max-w-[360px] max-h-[460px] overflow-y-auto px-3">
            {searchResults && searchResults?.length > 0 ? (
              searchResults?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={
                      'grid grid-cols-[1fr_1fr_60px] gap-5 items-center'
                    }
                  >
                    <p className={'line-clamp-1'}>
                      {item.recipient?.parent_name}
                    </p>
                    <p className={'line-clamp-1'}>
                      {item.recipient?.first_name}
                    </p>
                    <div className={'w-fit flex gap-1'}>
                      {item.user_id && (
                        <Link href={`/dashboard/${item.user_id}`}>
                          <Icon_refresh className="size-5" />
                        </Link>
                      )}
                      <Link href={`/admin/${item.id}`}>
                        {item.user_id ? (
                          <Icon_edit className="size-5 text-primary" />
                        ) : (
                          <Icon_eyes className="size-5 text-primary" />
                        )}
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className={''}>No search results.</p>
            )}
          </div>
        </Menu>
      </ClMenuContainer>
    </div>
  )
}

export default SearchInput
