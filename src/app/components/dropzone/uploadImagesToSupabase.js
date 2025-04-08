import { createClient } from '@/config/supabase/supabaseClient'
import { revalidatePath } from 'next/cache'

const generateDateString = () => {
  const date = new Date()
  const day = date.getDay()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const milliSeconds = date.getMilliseconds()
  return `${day}${month}${year}${milliSeconds}`
}

export const uploadProfilePicture = async ({
  folder,
  table,
  images,
  userId,
}) => {
  const supabase = createClient()
  const uploadFile = images?.map(async (imgObj) => {
    const imageName = imgObj?.file?.path.replace(' ', '_')?.toLowerCase()
    const dateString = generateDateString()
    const { data: imageData, error } = await supabase.storage
      .from(folder)
      .upload(`${userId}/${dateString}-${imageName}`, imgObj?.file, {
        cacheControl: '3600',
        upsert: false,
      })
    return {
      ...imageData,
      blurDataURL: imgObj?.blurDataURL,
    }
  })

  const imagesUploadedToStorage = await Promise.all(uploadFile)
  const { data: profile_pictures, error: profile_pictures_error } =
    await supabase
      .from(table)
      .insert([{ ...imagesUploadedToStorage[0], owner_id: userId }])
      .select()
  if (profile_pictures) {
    const { id, ...newImagesUploadedToStorage } = imagesUploadedToStorage[0]
    const {
      data: active_profile_pictures,
      error: active_profile_pictures_error,
    } = await supabase
      .from('public_profiles')
      .update({ profile_picture: imagesUploadedToStorage[0] })
      .eq('id', userId)
      .select()
    if (active_profile_pictures) {
      return { data: active_profile_pictures, error: null }
    } else if (active_profile_pictures_error) {
      return { data: null, error: active_profile_pictures_error?.message }
    }
  } else if (profile_pictures_error) {
    return { data: null, error: profile_pictures_error?.message }
  }
}

export const publicUploadImagesToSupabase = async ({
  folder,
  images,
  table,
}) => {
  const supabase = createClient()
  const uploadFile = images?.map(async (imgObj) => {
    const imageName = imgObj?.file?.path.replace(' ', '_')?.toLowerCase()
    const dateString = generateDateString()
    const { data: imageData, error } = await supabase.storage
      .from(folder)
      .upload(`${dateString}-${imageName}`, imgObj?.file, {
        cacheControl: '3600',
        upsert: false,
      })
    return {
      ...imageData,
      blurDataURL: imgObj?.blurDataURL,
    }
  })

  const imagesUploadedToStorage = await Promise.all(uploadFile)
  const { data, error } = await supabase
    .from(table)
    .insert(imagesUploadedToStorage)
    .select()
  if (data) {
    return { data: data, error: null }
  } else if (error) {
    return { data: null, error: error?.message }
  }
}

export const uploadImagesToSupabase = async ({
  folder,
  images,
  userId,
  table,
}) => {
  const supabase = createClient()
  const uploadFile = images?.map(async (imgObj) => {
    const imageName = imgObj?.file?.path.replace(' ', '_')?.toLowerCase()
    const dateString = generateDateString()
    const { data: imageData, error } = await supabase.storage
      .from(folder)
      .upload(`${userId}/${dateString}-${imageName}`, imgObj?.file, {
        cacheControl: '3600',
        upsert: false,
      })
    return {
      ...imageData,
      blurDataURL: imgObj?.blurDataURL,
    }
  })

  const imagesUploadedToStorage = await Promise.all(uploadFile)
  const { data, error } = await supabase
    .from(table)
    .insert(imagesUploadedToStorage)
    .select()
  if (data) {
    return { data: data, error: null }
  } else if (error) {
    return { data: null, error: error?.message }
  }
}
