'use server'

import { revalidatePath } from 'next/cache'

export const util_customRevalidatePath = async (path?: `/${string}`) => {
  revalidatePath(path ?? '/')
}
