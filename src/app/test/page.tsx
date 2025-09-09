import { I_supaorg_recipient } from '../_actions/orgRecipients/actions'
import { createAdmin } from '../config/supabase/supabaseAdmin'

const TestPage = async () => {
  const supabase = await createAdmin()
  const { data: oldUsers } = await supabase
    .from('users')
    .select('id, recipients(*)')

  const filteredusers =
    oldUsers?.filter((item) => !!item.recipients.length) ?? []

  const users = filteredusers
    .map((user) => {
      const unknown_recipient = user.recipients[0].recipient as unknown
      const recipient = unknown_recipient as I_supaorg_recipient | undefined
      const path_url = recipient?.path_url
      return { path_url, id: user.id }
    })

  return <pre>{JSON.stringify(users, null, 2)}</pre>
}

export default TestPage
