'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Image from 'next/image'
import anonymousImg from './images/user.webp'
import { supa_insert_deleted_messages } from './actions'
import { util_formatTimePast } from '@/app/utilities/date-and-time/util_formatTimePast'
import { I_Comments } from '@/types/Comments.types'
import { I_supa_select_user_Response_Types } from '@/app/_actions/users/actions'

export interface I_Messages {
  clUser_id: string
  setcomments: Dispatch<SetStateAction<I_Comments[]>>
  comments: I_Comments[]
  selectedUser: I_supa_select_user_Response_Types | null
}

const Messages = ({
  clUser_id,
  comments,
  setcomments,
  selectedUser,
}: I_Messages) => {
  const [lastVisible, setlastVisible] = useState<number>(6)

  comments.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })

  const handleLoadMore = () => {
    setlastVisible((prev) => prev + 10)
  }
  const handleDelete = async (
    item: I_supa_receipients_deleted_messages_insert
  ) => {
    setcomments((prev) => {
      return prev.filter((comment) => {
        return comment.id !== item.id
      })
    })
    await supa_insert_deleted_messages(item)
  }
  return (
    <div
      className={
        'rounded-lg shadow-[0px_0px_25.27px_0px_#2FABDD40] mt-4 md:mt-[29px]'
      }
    >
      <div
        className={
          'bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] h-4 w-full rounded-t-md'
        }
      />
      <div className={'divide-y divide-[#B0E0F1]'}>
        {comments
          .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return dateB - dateA
          })
          .map((item, index) => {
            if (index > lastVisible) return
            const isLastItem = index === lastVisible
            return (
              <div key={item.id} className="even:bg-white odd:bg-[#F7FCFF]">
                {!isLastItem ? (
                  <div className={'px-9 pt-6 pb-7 md:pt-[23px] md:pb-[23px]'}>
                    <div
                      className={
                        'flex flex-col md:flex-row md:justify-between items-center gap-[21px] md:gap-6'
                      }
                    >
                      <div
                        className={
                          'flex flex-col md:flex-row gap-6 items-center'
                        }
                      >
                        <div
                          className={
                            'min-w-[64px] min-h-[64px] md:min-w-[60px] md:min-h-[60px] border-[3px] border-[#288CCC] rounded-full overflow-hidden relative'
                          }
                        >
                          {item.type === 'website' && (
                            <Image
                              src={
                                item.profile_picture_website &&
                                item.profile_picture_website.profile_picture
                                  ?.fullPath
                                  ? `${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}/${item.profile_picture_website.profile_picture?.fullPath}`
                                  : anonymousImg
                              }
                              alt="Profile picture of adley"
                              quality={100}
                              fill
                              className="object-cover"
                            />
                          )}
                          {(item.type === 'facebook' ||
                            item.type === 'instagram') && (
                            <Image
                              src={
                                item.profile_picture
                                  ? item.profile_picture
                                  : anonymousImg
                              }
                              alt="Profile picture of adley"
                              quality={100}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className={'text-center md:text-left'}>
                          <p
                            className={
                              'text-xl font-acuminProSemibold text-[#009933] font-semibold'
                            }
                          >
                            {item.name}
                          </p>
                          <p className={'text-primary'}>{item.message}</p>
                        </div>
                      </div>
                      <div className={'min-w-[90px] text-right'}>
                        {selectedUser && (
                          <p
                            onClick={() =>
                              handleDelete({
                                id: item.id,
                                recipient_id: selectedUser.id,
                                user_id: clUser_id,
                              })
                            }
                            className={
                              'uppercase bg-[#2F8EDD] text-white p-[2px] text-[10px] text-nowrap h-fit rounded-md px-2 py-[2px] cursor-pointer'
                            }
                          >
                            hide message
                          </p>
                        )}
                        <p
                          className={
                            'text-center text-sm text-[#B3B3B3] mt-[3px]'
                          }
                        >
                          {util_formatTimePast(
                            new Date(item.created_at)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={'even:bg-white odd:bg-[#F7FCFF]'}>
                    <p
                      className={
                        'text-primary underline text-center py-4 w-fit cursor-pointer mx-auto'
                      }
                      onClick={handleLoadMore}
                    >
                      Load more messages...
                    </p>
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Messages
