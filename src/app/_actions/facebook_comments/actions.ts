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
    const query = supabase
      .from('facebook_comments')
      .select('*', { count: 'exact' })
      .eq('post_id', options.post_id)
      .neq('is_hidden', true)
      .neq('is_deleted', true)
      .order('created_time', { ascending: false })
      .limit(newLimit)
      .range(from, to)

    const { data, error, count } = await query
    if (error) throw new Error(error.message)
    return { data, count: count ?? 0, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const thisError = error?.message as string
    return { data: [], count: 0, error: thisError }
  }
}
