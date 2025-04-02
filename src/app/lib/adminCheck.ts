import { notFound } from 'next/navigation'

export const isAdmin = ({
  clRole,
  clThrowIfUnauthorized,
}: {
  clRole: I_supa_enumTypes_role | null | undefined
  clThrowIfUnauthorized?: boolean
}) => {
  // user object: containing "role" example ("super_admin")
  if (!clRole) return false
  const admin = ['admin']
  const isAdmin = admin.includes(clRole)
  if (clThrowIfUnauthorized && !isAdmin) notFound()
  return isAdmin
}
