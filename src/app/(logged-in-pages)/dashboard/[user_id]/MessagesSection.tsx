'use client'
import DividerText from '@/app/components/DividerText'
import ShowOrHide from './ShowOrHide'
import Messages, { I_Messages } from './Messages'
import useToggle from '@/app/hooks/useToggle'
import { useEffect, useState } from 'react'

const MessagesSection = ({
  clRecipientObj,
  clUser_id,
}: Omit<I_Messages, 'setcomments' | 'comments'>) => {
  const { clToggle: setshowMessages, clisToggled: showMessages } =
    useToggle(true)
  const [comments, setcomments] = useState<I_supaorg_comments[]>(
    clRecipientObj.comments
  )
  useEffect(() => {
    setcomments(clRecipientObj.comments)
  }, [clRecipientObj.comments])
  return (
    <div
      className={
        'flex flex-col-reverse md:flex-row items-center md:items-start gap-4 md:gap-[50px]  pt-5 pb-5 md:pt-7 md:pb-7 px-5 md:px-10 bg-[#EFF7FC] min-h-[130px]'
      }
    >
      {comments.length > 0 && (
        <div className={'md:min-w-full xl:min-w-[900px] w-full'}>
          <div className={'flex gap-9'}>
            <DividerText
              clContainerClassName="hidden md:block"
              clBorderTopClassName="border-[#92CCED]"
            >
              <p className={'text-nowrap md:text-2xl uppercase text-[#B3D8F3]'}>
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
              clRecipientObj={clRecipientObj}
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
                'hidden xl:block p-3 bg-[#2F8EDD] rounded-[4px] mt-8 text-white relative w-full 2xl:min-w-[406px] max-w-[406px]'
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
