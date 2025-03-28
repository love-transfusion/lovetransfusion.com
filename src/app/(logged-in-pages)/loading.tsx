'use client'

const Loader = () => {
  return (
    <>
      <div className="hidden md:block w-full max-w-[100vw]">
        <div
          className={
            'w-full bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[34px] rounded-md'
          }
        />
        {/* Profile and Map Section */}
        <div
          className={
            'flex flex-wrap xl:flex-nowrap justify-between xl:gap-8 pt-[30px] xl:pt-[46px] pb-8 md:pb-[38px] xl:pb-[50px] pl-0 md:pl-10 2xl:pl-[45px] pr-0 md:pr-[34px] 2xl:pr-[30px]'
          }
        >
          <div
            className={
              'max-sm:flex max-sm:justify-center max-sm:flex-wrap max-sm:items-center justify-center items-center max-sm:gap-5 min-w-[208px] max-w-[208px] w-full pt-4 xl:pt-[unset] max-sm:px-4'
            }
          >
            <div
              className={
                'w-[198px] h-[198px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse rounded-full mx-auto'
              }
            />
            <div className={'mt-2 text-left md:text-center'}>
              <div
                className={
                  'w-[124px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[22px] rounded-md mx-auto'
                }
              />
            </div>
            <div
              className={'hidden relative md:flex flex-col h-fit items-center'}
            >
              <div
                className={
                  'w-[180px] h-[98px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse rounded-md mt-7'
                }
              />
            </div>
          </div>
          <div className={'w-full md:w-[440px] lg:w-[680px] xl:w-full'}>
            <div
              className={
                'w-auto bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[170px] md:h-[370px] rounded-md'
              }
            />
            <div className={'hidden xl:block mt-10'}>
              <div className={'flex gap-6'}>
                <div
                  className={
                    'w-full bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[70px] rounded-md'
                  }
                />
                <div
                  className={
                    'w-full bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[70px] rounded-md'
                  }
                />
                <div
                  className={
                    'w-full bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[70px] rounded-md'
                  }
                />
              </div>
            </div>
          </div>
          <div className={'max-sm:w-full md:w-full xl:w-[unset]'}>
            <div className={'xl:hidden'}>
              <div
                className={
                  'w-full xl:min-w-[333px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse md:mt-10 xl:mt-[unset] h-[443px] rounded-md'
                }
              />
            </div>
            <div
              className={
                'hidden xl:block min-w-[333px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[443px] rounded-md'
              }
            />
          </div>
        </div>
      </div>
      <div className={'hidden xl:block w-full max-w-[100vw] px-8 mb-[220px]'}>
        <div
          className={
            'w-full bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[170px] rounded-md mx-8'
          }
        />
      </div>
      <div
        className={'w-full h-screen flex flex-col items-center md:hidden px-8'}
      >
        <div
          className={
            'w-[220px] h-[120px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse rounded-md mt-[77px]'
          }
        />
        <div
          className={
            'w-full h-[170px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse rounded-md mt-[50px]'
          }
        />
        <div
          className={
            'w-[205px] h-[67px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse rounded-md mt-[50px] z-10'
          }
        />
        <div
          className={
            'w-[205px] h-[67px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse rounded-md mt-10 z-10'
          }
        />
        <div
          className={
            'w-[205px] h-[67px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse rounded-md my-10 z-10'
          }
        />
      </div>
    </>
  )
}

export default Loader
