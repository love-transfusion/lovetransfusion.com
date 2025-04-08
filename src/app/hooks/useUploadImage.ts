'use client'
import { useState, useCallback, useTransition } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '../config/supabase/supabaseClient'
import { Database } from '@/types/database.types'

const generateBlurDataUrl = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) return

      img.src = e.target.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 20
        canvas.height = 20
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, 20, 20)
        resolve(canvas.toDataURL('image/jpeg', 0.6))
      }
    }

    reader.readAsDataURL(file)
  })
}

export type I_LocalImage = {
  file: File
  previewUrl: string
  blurDataURL: string
}

interface I_useUploadImage {
  clUser_id: string
  clStorageName: string
  clSingleImageOnly?: boolean
  clTableName: keyof Database['public']['Tables']
}

export function useUploadImage({
  clUser_id,
  clStorageName,
  clSingleImageOnly,
  clTableName,
}: I_useUploadImage) {
  const [images, setImages] = useState<I_LocalImage[]>([])
  const [isProcessing, startProcessing] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // 1. On drop — preview and blur, but don’t upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    startProcessing(async () => {
      setError(null)

      const formData = new FormData()
      acceptedFiles.forEach((file, index) => {
        formData.append(`file-${index}`, file)
      })

      //   const blurResults = await generateBlurDataURL(formData)

      const newImages: I_LocalImage[] = await Promise.all(
        acceptedFiles.map(async (file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
          blurDataURL: await generateBlurDataUrl(file),
        }))
      )

      if (!clSingleImageOnly) {
        setImages((prev) => [...prev, ...newImages])
      } else {
        setImages([...newImages])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: !clSingleImageOnly,
  })

  // 2. Submit handler — upload to Supabase
  const uploadAllToSupabase = async () => {
    const supabase = await createClient()
    for (const image of images) {
      const filePath = `${clUser_id}/${Date.now()}-${image.file.name}`

      const { error: uploadError } = await supabase.storage
        .from(clStorageName)
        .upload(filePath, image.file)

      if (uploadError) {
        setError(uploadError.message)
        continue
      }

      const { error: dbError } = await supabase.from(clTableName).upsert({
        user_id: clUser_id,
        storage_path: filePath,
        blur_data_url: image.blurDataURL,
        bucket_name: clStorageName,
      })

      if (dbError) {
        setError(dbError.message)
        continue
      }
    }

    // Optional: clear after upload
    setImages([])
  }

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    images,
    isProcessing,
    error,
    uploadAllToSupabase,
  }
}
