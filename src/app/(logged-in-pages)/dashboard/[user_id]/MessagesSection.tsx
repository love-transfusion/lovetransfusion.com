'use client'
import DividerText from '@/app/components/DividerText'
import ShowOrHide from './ShowOrHide'
import Messages, { I_Messages } from './Messages'
import useToggle from '@/app/hooks/useToggle'

const MessagesSection = ({ clRecipientObj }: I_Messages) => {
  const { clToggle: setshowMessages, clisToggled: showMessages } =
    useToggle(true)
  return (
    <div
      className={
        'flex flex-col-reverse md:flex-row items-start gap-4 md:gap-[50px]  pt-5 pb-5 md:pt-7 md:pb-7 px-5 md:px-10 bg-[#EFF7FC] min-h-[130px] max-w-[1440px]'
      }
    >
      <div className={'md:min-w-full xl:min-w-[900px]'}>
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
        {showMessages && <Messages clRecipientObj={clRecipientObj} />}
      </div>
      <div className={'w-full block md:hidden xl:block'}>
        <ShowOrHide clToggle={setshowMessages} clisToggled={showMessages} />
        {showMessages && (
          <div
            className={
              'hidden xl:block p-3 bg-[#2F8EDD] rounded-[4px] mt-8 text-white relative'
            }
          >
            <div
              className={
                'bg-gradient-to-r p-3 rounded-[4px] from-[#2F8EDD] to-[#2FA2DD]'
              }
            >
              <p className={'font-acuminProSemibold'}>PARENTS:</p>
              <div className={'flex flex-col gap-2'}>
                <p className={''}>
                  You have full{' '}
                  <span className="font-acuminProSemibold">control</span> over
                  messages.
                </p>
                <p className={''}>
                  They are all displayed by default, however, you may hide them{' '}
                  <span className="font-acuminProSemibold">individually</span>{' '}
                  or hide <span className="font-acuminProSemibold">all</span>{' '}
                  messages using the toggle switch above.
                </p>
              </div>
            </div>
            <div className="border-r-[35px] border-y-[25px] border-[#2F8EDD] border-y-transparent absolute -left-[35px] top-0 bottom-0 my-auto h-fit" />
          </div>
        )}
      </div>
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
