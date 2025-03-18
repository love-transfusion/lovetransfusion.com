import Icon_eyes from '@/app/components/icons/Icon_eyes'
import Icon_left from '@/app/components/icons/Icon_left'
import Icon_refresh from '@/app/components/icons/Icon_refresh'
import Icon_right from '@/app/components/icons/Icon_right'
import Icon_search from '@/app/components/icons/Icon_search'
import Icon_trash from '@/app/components/icons/Icon_trash'
import Input from '@/app/components/inputs/basic-input/Input'
import React from 'react'

const Dashboard = () => {
  return (
    <>
      <div className={'max-w-[1480px] mx-auto px-4 md:px-6 lg:px-10 xl:px-10 '}>
        <div
          className={
            'flex flex-col md:flex-row justify-between items-center gap-2 pt-10 md:pt-[68px] pb-5'
          }
        >
          <p className={'text-2xl md:text-[32px] font-bold'}>User Management</p>
          <Input
            clPlaceholder="Search..."
            clVariant="input2"
            clLeftIcon={<Icon_search />}
            clIconClassName="text-neutral-400"
            className="shadow-inner max-w-[255px]"
          />
        </div>
        <div className={'overflow-hidden shadow-lg rounded-lg md:rounded-xl'}>
          <div className={'overflow-x-auto pb-4'}>
            <table className="table-auto w-full">
              <thead className="bg-[#2F8FDD] text-white">
                <tr className="text-left text-lg leading-tight">
                  <td className="px-3 min-w-[140px] py-2">Parent Name</td>
                  <td className="px-3 min-w-[140px] py-2">Email</td>
                  <td className="px-3 min-w-[140px] py-2">Recipient Name </td>
                  <td className="px-3 min-w-[140px] py-2">Relationship</td>
                  <td className="px-3 min-w-[140px] py-2">Date Submitted</td>
                  <td className="px-3 min-w-[140px] py-2">Date Of Birth</td>
                  <td className="px-3 min-w-[140px] py-2">Engagements</td>
                  <td className="px-3 min-w-[140px] py-2">Actions</td>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-[#F3F3F3] border-y border-neutral-200">
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <div className={'flex gap-2'}>
                      <Icon_refresh className="size-5" />
                      <Icon_eyes className="size-5 text-primary" />
                      <Icon_trash className="size-5 text-red-500" />
                    </div>
                  </td>
                </tr>
                <tr className="even:bg-[#F3F3F3] border-y border-neutral-200">
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <div className={'flex gap-2'}>
                      <Icon_refresh className="size-5" />
                      <Icon_eyes className="size-5 text-primary" />
                      <Icon_trash className="size-5 text-red-500" />
                    </div>
                  </td>
                </tr>
                <tr className="even:bg-[#F3F3F3] border-y border-neutral-200">
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <div className={'flex gap-2'}>
                      <Icon_refresh className="size-5" />
                      <Icon_eyes className="size-5 text-primary" />
                      <Icon_trash className="size-5 text-red-500" />
                    </div>
                  </td>
                </tr>
                <tr className="even:bg-[#F3F3F3] border-y border-neutral-200">
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <div className={'flex gap-2'}>
                      <Icon_refresh className="size-5" />
                      <Icon_eyes className="size-5 text-primary" />
                      <Icon_trash className="size-5 text-red-500" />
                    </div>
                  </td>
                </tr>
                <tr className="even:bg-[#F3F3F3] border-y border-neutral-200">
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <p className={''}>Test</p>
                  </td>
                  <td className="py-[6px] px-3">
                    <div className={'flex gap-2'}>
                      <Icon_refresh className="size-5" />
                      <Icon_eyes className="size-5 text-primary" />
                      <Icon_trash className="size-5 text-red-500" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={'flex gap-2 items-center my-3 justify-end px-6'}>
            <Icon_left className="size-5" />
            <div
              className={'size-8 relative bg-[#2F8FDD] rounded-full text-white'}
            >
              <p
                className={
                  'absolute top-0 bottom-0 right-0 left-0 m-auto h-fit w-fit'
                }
              >
                1
              </p>
            </div>
            <Icon_right className="size-5" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
