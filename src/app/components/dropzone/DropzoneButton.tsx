/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { generateBlurDataURL } from './actions'
import { twMerge } from 'tailwind-merge'
import { useStore } from 'zustand'
import Icon_upload from '../icons/Icon_upload'
import utilityStore from '@/app/utilities/store/utilityStore'
import Button from '../Button/Button'

// guide:
// Add these
// const [selectedImages, setSelectedImages] = useState([])
// const [imagesWithBlurDataUrl, setImagesWithBlurDataUrl] = useState(null)

{
  /* <CltDropzoneButton
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

const CltDropzoneButton = ({
  parameters: {
    selectedImages,
    setSelectedImages,
    setImagesWithBlurDataUrl,
    containerStyle,
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: quantityLimit,
    maxSize: 1024 * 1000 * maxSize || 1024 * 1000 * 4.1,
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
      <Button {...getRootProps()} className={twMerge('', containerStyle)}>
        <input {...getInputProps()} className="w-full" />
        <Icon_upload /> Edit
      </Button>
    </div>
  )
}

export default CltDropzoneButton
