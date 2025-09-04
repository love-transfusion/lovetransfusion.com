/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from '@/types/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

// UPDATE for partial changes; INSERT fallback if the comment row isn’t there yet.
export async function markCommentDeleted(
  supabase: SupabaseClient<Database, 'public'>,
  args: {
    comment_id: string
    post_id: string
    created_time_unix?: number
  }
) {
  const nowIso = new Date().toISOString()

  // 1) Try update (partial is OK)
  const { data: upd, error: updErr } = await supabase
    .from('facebook_comments')
    .update({ is_deleted: true, updated_at: nowIso })
    .eq('comment_id', args.comment_id)
    .select('comment_id') // forces Postgrest to return affected rows

  if (updErr) return { ok: false, error: updErr.message }
  if (upd && upd.length > 0) return { ok: true } // row existed; we’re done

  // 2) Fallback insert with minimal required fields
  const createdIso = args.created_time_unix
    ? new Date(args.created_time_unix * 1000).toISOString()
    : nowIso

  const { error: insErr } = await supabase.from('facebook_comments').insert({
    comment_id: args.comment_id,
    post_id: args.post_id,
    created_time: createdIso, // REQUIRED by schema
    is_deleted: true,
    is_hidden: false,
    updated_at: nowIso,
  } as any) // cast if your generated types still complain

  if (insErr) return { ok: false, error: insErr.message }
  return { ok: true }
}

export async function markCommentHidden(
  supabase: SupabaseClient<Database>,
  args: {
    comment_id: string
    post_id: string
    created_time_unix?: number
  }
) {
  const nowIso = new Date().toISOString()
  //   const supabase = await createAdmin()

  const { data: upd, error: updErr } = await supabase
    .from('facebook_comments')
    .update({ is_hidden: true, updated_at: nowIso })
    .eq('comment_id', args.comment_id)
    .select('comment_id')

  if (updErr) return { ok: false, error: updErr.message }
  if (upd && upd.length > 0) return { ok: true }

  const createdIso = args.created_time_unix
    ? new Date(args.created_time_unix * 1000).toISOString()
    : nowIso

  const { error: insErr } = await supabase.from('facebook_comments').insert({
    comment_id: args.comment_id,
    post_id: args.post_id,
    created_time: createdIso,
    is_hidden: true,
    is_deleted: false,
    updated_at: nowIso,
  } as any)

  if (insErr) return { ok: false, error: insErr.message }
  return { ok: true }
}
