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

const CltDropzone = ({
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
    <div>
      <div
        {...getRootProps()}
        className={twMerge(
          'w-full bg-white text-[#C4C6C9] py-8 px-3 border-[1px] border-neutral-300 border-dashed relative flex flex-col gap-2 justify-center items-center',
          containerStyle
        )}
      >
        <input {...getInputProps()} className="w-full" />
        {isDragActive ? (
          <p>Drop file(s) here ...</p>
        ) : (
          <p className="select-none">
            {placeholder || 'Click to upload files, or drag & drop files here.'}
          </p>
        )}
        {selectedImages?.length > 0 && (
          <div
            className={twMerge(
              'grid grid-cols-2 md:grid-cols-4 gap-2 mt-2',
              selectedContainerStyle
            )}
          >
            {selectedImages?.map((image, index) => {
              return (
                <div key={index} className="relative">
                  <Image
                    src={`${URL.createObjectURL(image)}`}
                    width={300}
                    height={300}
                    quality={100}
                    key={index}
                    alt="uploaded image"
                    className="my-auto"
                  />
                  {!imagesWithBlurDataUrl && (
                    <Icon_spinner className="absolute animate-spin top-0 bottom-0 right-0 left-0 mx-auto my-auto size-10 text-white" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CltDropzone
