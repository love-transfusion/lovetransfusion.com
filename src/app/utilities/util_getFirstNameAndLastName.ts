interface I_firstNameLastName {
  firstName: string
  lastName: string
}
export const util_getFirstAndLastName = (
  fullName: string
): I_firstNameLastName => {
  const parts = fullName.trim().split(/\s+/)

  const firstName = parts[0]
  const lastName = parts.slice(1).join(' ') // everything after the first word

  return { firstName, lastName }
}
