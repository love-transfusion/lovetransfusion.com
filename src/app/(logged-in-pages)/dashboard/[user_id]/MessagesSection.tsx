'use client'
import DividerText from '@/app/components/DividerText'
import ShowOrHide from './ShowOrHide'
import Messages from './Messages'
import useToggle from '@/app/hooks/useToggle'
import { useEffect, useState } from 'react'
import { I_Comments } from '@/types/Comments.types'
import { I_supa_select_user_Response_Types } from '@/app/_actions/users/actions'

interface I_MessagesSection {
  clComments: I_Comments[]
  clUser_id: string
  selectedUser: I_supa_select_user_Response_Types | null
}

const MessagesSection = ({
  selectedUser,
  clComments,
  clUser_id,
}: I_MessagesSection) => {
  const { clToggle: setshowMessages, clisToggled: showMessages } =
    useToggle(true)
  const [comments, setcomments] = useState<I_Comments[]>(clComments)

  useEffect(() => {
    setcomments(clComments)
  }, [clComments])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])
  return (
    <div
      className={
        'flex flex-col-reverse md:flex-row items-center md:items-start justify-center gap-4 md:gap-[65px] pl-5 pr-5 md:pl-[60px] md:pr-[60px] 2xl:pl-[86px] 2xl:pr-0 pt-5 pb-5 md:pt-7 md:pb-7 bg-[#EFF7FC] min-h-[130px]'
      }
    >
      {comments.length > 0 && (
        <div className={'md:min-w-full xl:min-w-[900px] w-full max-w-[959px]'}>
          <div className={'flex gap-9'}>
            <DividerText
              clContainerClassName="hidden md:block"
              clBorderTopClassName="border-[#92CCED] border-[1.7px]"
            >
              <p
                className={
                  'text-nowrap md:text-2xl uppercase text-[#B3D8F3] font-acumin-variable-103 tracking-[1px]'
                }
              >
                messages
              </p>
            </DividerText>
            <ShowOrHide
              clToggle={setshowMessages}
              clisToggled={showMessages}
              clContainerClassName="hidden md:flex xl:hidden"
            />
          </div>
          {showMessages && (
            <Messages
              selectedUser={selectedUser}
              clUser_id={clUser_id}
              setcomments={setcomments}
              comments={comments}
            />
          )}
        </div>
      )}
      {comments.length > 0 && (
        <div className={'block md:hidden xl:block'}>
          <ShowOrHide clToggle={setshowMessages} clisToggled={showMessages} />
          {showMessages && (
            <div
              className={
                'hidden xl:block p-3 bg-[#2F8EDD] rounded-[4px] mt-8 text-white relative w-full 2xl:min-w-[330px] max-w-[330px]'
              }
            >
              <div
                className={
                  'bg-gradient-to-r p-3 rounded-[4px] from-[#2F8EDD] to-[#2FA2DD]'
                }
              >
                <p className={'font-semibold'}>PARENTS:</p>
                <div className={'flex flex-col gap-2'}>
                  <p className={''}>
                    You have <span className="font-bold">full control</span>{' '}
                    over messages.
                  </p>
                  <p className={''}>
                    They are all displayed by default, however, you may hide
                    them <span className="font-bold">individually</span> or hide{' '}
                    <span className="font-bold">all</span> messages using the
                    toggle switch above.
                  </p>
                </div>
              </div>
              <div className="border-r-[35px] border-y-[25px] border-[#2F8EDD] border-y-transparent absolute -left-[35px] top-0 bottom-0 my-auto h-fit" />
            </div>
          )}
        </div>
      )}
      <DividerText
        clContainerClassName="block md:hidden"
        clBorderTopClassName="border-[#92CCED]"
      >
        <p className={'text-nowrap md:text-2xl uppercase text-[#B3D8F3]'}>
          messages
        </p>
      </DividerText>
    </div>
  )
}

export default MessagesSection
