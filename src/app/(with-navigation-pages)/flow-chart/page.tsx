import WistiaPlayer from '@/app/components/WistiaPlayer'
import React from 'react'
import DownloadButton from './DownloadButton'

const FlowChartPage = async () => {
  return (
    <div className={'pb-10 pt-10 md:pb-20 md:pt-20'}>
      <div className={'container md:px-6 lg:px-10 xl:px-0 '}>
        <p
          className={
            'font-acumin-variable-68 font-bold text-balance text-[32px] md:text-4xl lg:text-5xl text-primary text-center max-w-[270px] md:max-w-[unset] mx-auto md:mx-[unset] leading-tight md:leading-[unset]'
          }
        >
          Connecting People Who Hurt With Those Who Care
        </p>
        <div className="max-w-[1120px] mx-auto mt-6 md:mt-10">
          <WistiaPlayer videoId={'ow4kttqlhy'} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 px-3 mt-8">
          <div>
            <WistiaPlayer videoId={'ow4kttqlhy'} />
            <p
              className={
                'text-xl md:text-[24px] text-primary font-acumin-variable-68 my-2 px-3'
              }
            >
              Video Title
            </p>
          </div>
          <div>
            <WistiaPlayer videoId={'ow4kttqlhy'} />
            <p
              className={
                'text-xl md:text-[24px] text-primary font-acumin-variable-68 my-2 px-3'
              }
            >
              Video Title
            </p>
          </div>
          <div>
            <WistiaPlayer videoId={'ow4kttqlhy'} />
            <p
              className={
                'text-xl md:text-[24px] text-primary font-acumin-variable-68 my-2 px-3'
              }
            >
              Video Title
            </p>
          </div>
          <div>
            <WistiaPlayer videoId={'ow4kttqlhy'} />
            <p
              className={
                'text-xl md:text-[24px] text-primary font-acumin-variable-68 my-2 px-3'
              }
            >
              Video Title
            </p>
          </div>
          <div>
            <WistiaPlayer videoId={'ow4kttqlhy'} />
            <p
              className={
                'text-xl md:text-[24px] text-primary font-acumin-variable-68 my-2 px-3'
              }
            >
              Video Title
            </p>
          </div>
          <div>
            <WistiaPlayer videoId={'ow4kttqlhy'} />
            <p
              className={
                'text-xl md:text-[24px] text-primary font-acumin-variable-68 my-2 px-3'
              }
            >
              Video Title
            </p>
          </div>
          <div>
            <WistiaPlayer videoId={'ow4kttqlhy'} />
            <p
              className={
                'text-xl md:text-[24px] text-primary font-acumin-variable-68 my-2 px-3'
              }
            >
              Video Title
            </p>
          </div>
          <div>
            <WistiaPlayer videoId={'ow4kttqlhy'} />
            <p
              className={
                'text-xl md:text-[24px] text-primary font-acumin-variable-68 my-2 px-3'
              }
            >
              Video Title
            </p>
          </div>
        </div>
        <DownloadButton />
      </div>
    </div>
  )
}

export default FlowChartPage
