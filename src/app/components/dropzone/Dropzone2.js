/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { generateBlurDataURL } from './actions'
import Icon_spinner from '../icons/Icon_spinner'
import { twMerge } from 'tailwind-merge'
import { useStore } from 'zustand'
import utilityStore from '@/utilities/store/utilityStore'
import Icon_images from '../icons/Icon_images'

// guide:
// Add these
// const [selectedImages, setSelectedImages] = useState([])
// const [imagesWithBlurDataUrl, setImagesWithBlurDataUrl] = useState(null)

{
  /* <CltDropzone
        parameters={{
          selectedImages,
          setSelectedImages,
          imagesWithBlurDataUrl,
          setImagesWithBlurDataUrl,
          placeholder: 'Click to upload file.',     // optional
          quantityLimit: 1,                         // optional
          accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/jpeg': ['.jpeg'],
            'image/svg': ['.svg'],
            'image/webp': ['.webp'],
          },
          maxSize: 2,                               // optional 2MB
        }}
      /> */
}

const CltDropzone2 = ({
  children,
  parameters: {
    selectedImages,
    setSelectedImages,
    imagesWithBlurDataUrl,
    setImagesWithBlurDataUrl,
    containerStyle,
    placeholder,
    selectedContainerStyle,
    quantityLimit,
    allowedType,
    maxSize, // Default is 4.1MB
  },
}) => {
  const { settoast } = useStore(utilityStore)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length > 0) {
      let error
      if (rejectedFiles[0]?.errors[0]?.message?.includes('File type must be')) {
        error = 'Invalid file type'
      } else if (
        rejectedFiles[0]?.errors[0]?.message?.includes('File is larger than')
      ) {
        error = 'File too large'
      }
      settoast({
        description: error || rejectedFiles[0]?.errors[0]?.message,
        status: 'error',
      })
    }
    if (acceptedFiles?.length > 0) {
      setSelectedImages(acceptedFiles)
    }
  }, [])

  const onUpload = async () => {
    let formData = new FormData()
    for (const image of selectedImages) {
      formData.append(image.name, image)
    }
    const blurDataImages = await generateBlurDataURL(formData)
    const newSelectedImages = selectedImages?.map((image) => {
      const data = blurDataImages.find((item) => item.key === image.path)
      const newFile = { file: image, blurDataURL: data.blurDataURL }
      return newFile
    })
    setImagesWithBlurDataUrl(newSelectedImages)
  }

  useEffect(() => {
    if (selectedImages?.length <= 0) return
    onUpload()
  }, [selectedImages])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles: quantityLimit,
    maxSize: maxSize || 1024 * 1000 * 4.1,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'image/svg': ['.svg'],
      'image/webp': ['.webp'],
    },
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={twMerge(
          `relative w-full bg-white text-[#C4C6C9] py-[17px] rounded-md px-3 border-[1px] flex flex-col gap-2 justify-center items-center border-[#ddedf9] overflow-hidden ${
            selectedImages?.length > 0 && 'bg-primary-50'
          }`,
          containerStyle
        )}
      >
        <input {...getInputProps()} className="w-full" />
        {isDragActive ? (
          <p className="select-none text-[12px] 2xl:text-sm text-left w-full">
            {`Drop file(s) here ...`}
          </p>
        ) : (
          <p className="select-none text-[12px] 2xl:text-sm text-left w-full">
            {placeholder || 'Click to upload files, or drag & drop files here.'}
          </p>
        )}
        {selectedImages?.length > 0 && (
          <div
            className={
              'flex items-center gap-1 absolute top-0 bottom-0 my-auto bg-white px-4 right-0'
            }
          >
            <Icon_images className="text-primary" />
            <p className={'text-primary'}>{selectedImages?.length}</p>
            {!imagesWithBlurDataUrl && (
              <Icon_spinner className="absolute animate-spin top-0 bottom-0 right-0 left-0 mx-auto my-auto size-8 text-primary" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CltDropzone2
