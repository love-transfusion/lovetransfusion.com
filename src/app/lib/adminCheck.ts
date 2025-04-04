import { notFound } from 'next/navigation'

export const isAdmin = ({
  clRole,
  clThrowIfUnauthorized,
}: {
  clRole: I_supa_enumTypes_role | null | undefined
  clThrowIfUnauthorized?: boolean
}) => {
  if (!clRole && clThrowIfUnauthorized) notFound()
  if (!clRole) return false
  const admin = ['admin']
  const isAdmin = admin.includes(clRole)
  if (clThrowIfUnauthorized && !isAdmin) notFound()
  return isAdmin
}
