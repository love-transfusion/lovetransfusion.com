'use client'
import { supa_admin_delete_auth_user } from '@/app/_actions/admin/actions'
import Button from '@/app/components/Button/Button'
import Icon_trash from '@/app/components/icons/Icon_trash'
import usePopup from '@/app/hooks/usePopup'
import React, { useState } from 'react'

const DeleteUser = ({ user_id }: { user_id: string }) => {
  const { clIsOpen, clTogglePopup, Popup } = usePopup()
  const [isLoading, setisLoading] = useState<boolean>(false)

  const handleDelete = async () => {
    setisLoading(true)
    await supa_admin_delete_auth_user(user_id)
    clTogglePopup()
  }
  return (
    <>
      <Icon_trash
        className="size-5 text-red-500"
        onClick={() => clTogglePopup()}
      />
      <Popup
        clIsOpen={clIsOpen}
        clTogglePopup={clTogglePopup}
        className="p-0 text-white"
      >
        <div
          className={'flex flex-col items-center h-full justify-center'}
          style={{
            background:
              'linear-gradient(rgb(47, 142, 221) 0%, rgb(47, 157, 221) 33%, rgb(47, 171, 221) 69%, rgb(47, 186, 221) 97%)',
          }}
        >
          <div className={'px-3 md:px-14 w-fit'}>
            <p
              className={
                'font-acumin-condensed text-3xl font-bold mx-auto w-[290px] text-left'
              }
            >
              Are you sure you want to delete this user?
            </p>
            <ul className="list-disc pl-5 mt-3 text-[17px]">
              <li>{`The user's profile information`}</li>
              <li>{`The user's authentication account`}</li>
              <li>All associated data for this user</li>
            </ul>
            <div className={'flex gap-5 justify-start mt-6'}>
              <Button
                onClick={handleDelete}
                clSize="md"
                className="rounded-md text-primary px-14"
                clTheme="light"
              >
                {isLoading ? 'Deleting...' : 'Yes'}
              </Button>
              <Button
                clSize="md"
                className="rounded-md px-14"
                clVariant="outlined"
                onClick={() => clTogglePopup()}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      </Popup>
    </>
  )
}

export default DeleteUser
