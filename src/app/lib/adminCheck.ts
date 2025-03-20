import { notFound } from 'next/navigation'

export const isAdmin = (
  clRole: I_supa_enumTypes | null | undefined,
  clAllowOnlyAdmin?: boolean
) => {
  // user object: containing "role" example ("super_admin")
  if (!clRole) return
  const admin = ['admin']
  const isAdmin = admin.includes(clRole)
  if (clAllowOnlyAdmin && !isAdmin) notFound()
  return isAdmin
}
