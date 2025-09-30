'use client'
import React from 'react'
// import { handleDownload } from './downloadPDF'

const DownloadButton = () => {
  const handleClick = async () => {
    const link = document.createElement('a')
    link.href = '/pdf/LT-flow-chart.pdf'
    link.download = 'LT-flow-chart.pdf' // forces download
    link.click()
  }
  return (
    <div
      onClick={handleClick}
      className="text-white text-lg px-10 py-4 bg-primary rounded-lg shadow-md hover:bg-primary-500 active:bg-primary-600 duration-300 mt-8 w-fit mx-auto cursor-pointer"
    >
      <p>Download Flow Chart</p>
    </div>
  )
}

export default DownloadButton
