'use client'
import React from 'react'
import Icon_copy from '../components/icons/Icon_copy'
import { util_copyToClipboard } from '../utilities/util_copyToClipboard'

interface CopyTokenTypes {
  userToken: string
  pageToken: string
}

const CopyToken = ({ userToken, pageToken }: CopyTokenTypes) => {
  const handleCopyUserToken = async () => {
    await util_copyToClipboard(userToken)
  }
  const handleCopyPageToken = async () => {
    await util_copyToClipboard(pageToken)
  }
  return (
    <>
      <div
        className={'flex gap-2 cursor-pointer'}
        onClick={handleCopyUserToken}
      >
        <Icon_copy /> Copy User Token
      </div>
      <div
        className={'flex gap-2 cursor-pointer'}
        onClick={handleCopyPageToken}
      >
        <Icon_copy /> Copy Page Token
      </div>
    </>
  )
}

export default CopyToken
