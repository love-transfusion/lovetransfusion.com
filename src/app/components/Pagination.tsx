'use client'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import Icon_left from './icons/Icon_left'
import Icon_right from './icons/Icon_right'
import { useRouter } from 'next/navigation'
import { useRouteProgress } from './Link/RouteProgressProvider'

interface PaginationTypes {
  className?: string
  /** String of number */
  clCurrentPage: string
  clCount: number
  clLimit: number
  clExistingSearchParams?: Record<string, string>[]
}

const Pagination = ({
  className,
  clCurrentPage: stringCurrentPage,
  clCount,
  clLimit,
  clExistingSearchParams = [],
}: PaginationTypes) => {
  const { start } = useRouteProgress()
  const router = useRouter()
  const pageLimit = clCount / clLimit
  const clCurrentPage = parseInt(stringCurrentPage ?? '1')

  const pages = Array.from({ length: 4 }, (_, i) => {
    const newItem = clCurrentPage + i
    if (pageLimit > newItem - 1) {
      return newItem
    }
    return
  }).filter((item) => item !== undefined)

  const getURL = (nextPage: number) => {
    const result = !!clExistingSearchParams.length
      ? clExistingSearchParams.map((item) => {
          return Object.entries(item)
            .map(([key, value]) => {
              if (key === 'page') {
                return `${key}=${nextPage}`
              }
              return value.trim() ? `${key}=${value}` : ''
            })
            .filter((item) => item.trim())
            .join('&')
        })[0]
      : `page=${nextPage}`

    return result
  }

  const handleClick = (pageNumber: number) => {
    if (pageNumber === clCurrentPage) return
    start()
    const getUrl = getURL(pageNumber)
    router.push(`?${getUrl}`)
  }

  const handleHover = (pageNumber: number) => {
    if (pageNumber === clCurrentPage) return
    const getUrl = getURL(pageNumber)
    router.prefetch(`?${getUrl}`)
  }
  return (
    <div className={twMerge('flex gap-1', className)}>
      <div
        onMouseEnter={() => handleHover(clCurrentPage - 1)}
        onClick={() => handleClick(clCurrentPage - 1)}
        className={`flex flex-col rounded-md justify-center relative w-12 h-14 border-2 border-primary-100 hover:bg-[#2F8FDD] hover:text-white cursor-pointer ${
          clCurrentPage <= 1 && 'hidden'
        }`}
      >
        <Icon_left
          className={'absolute top-4 right-0 left-0 mx-auto w-fit size-5'}
        />
      </div>
      <div className="flex gap-1">
        {pageLimit > 1 &&
          pages.map((pageNumber) => {
            return (
              <div
                onMouseEnter={() => handleHover(pageNumber)}
                onClick={() => handleClick(pageNumber)}
                className={`flex flex-col rounded-md relative w-12 h-14 border-2 border-primary-100 hover:bg-[#2F8FDD] hover:text-white cursor-pointer ${
                  pageNumber === clCurrentPage &&
                  'bg-[#2F8FDD] text-white pointer-events-none'
                }`}
                key={pageNumber}
              >
                <p
                  className={'absolute top-[13px] right-0 left-0 mx-auto w-fit'}
                >
                  {pageNumber}
                </p>
              </div>
            )
          })}
      </div>
      <div
        onMouseEnter={() => handleHover(clCurrentPage + 1)}
        onClick={() => handleClick(clCurrentPage + 1)}
        className={`flex flex-col rounded-md justify-center relative w-12 h-14 border-2 border-primary-100 hover:bg-[#2F8FDD] hover:text-white cursor-pointer ${
          clCurrentPage >= pageLimit && 'hidden'
        }`}
      >
        <Icon_right
          className={'absolute top-4 right-0 left-0 mx-auto w-fit size-5'}
        />
      </div>
    </div>
  )
}

export default Pagination
