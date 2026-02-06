'use server'

import { createServer } from '@/app/config/supabase/supabaseServer'

export const supa_select_facebook_comments = async (options: {
  clLimit: number
  clCurrentPage: number
  post_id?: string
}) => {
  if (!options.post_id)
    return { data: [], count: 0, error: 'Post ID is required.' }

  const newLimit = options.clLimit
  const from = options.clCurrentPage * newLimit - newLimit
  const to = options.clCurrentPage * newLimit - newLimit + (newLimit - 1)
  const supabase = await createServer()
  try {
    const { data, error, count } = await supabase
      .from('facebook_comments')
      .select('*', { count: 'exact' })
      .order('created_time', { ascending: false })
      .eq('post_id', options.post_id)
      .eq('is_deleted', false)
      .or('is_hidden.eq.false,is_hidden.is.null')
      .limit(newLimit)
      .range(from, to)

    if (error) throw new Error(error.message)
    return { data, count: count ?? 0, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: [], count: 0, error: thisError }
  }
}
