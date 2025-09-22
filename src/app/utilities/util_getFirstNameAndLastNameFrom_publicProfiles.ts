import { util_getFirstAndLastName } from './util_getFirstNameAndLastName'

export const util_getFirstNameAndLastNameFrom_publicProfiles = (options: {
  first_name: string | null | undefined
  last_name: string | null | undefined
  full_name: string | null | undefined
}) => {
  if (options.first_name) {
    return {
      first_name: options.first_name,
      last_name: options.last_name || '',
    }
  } else if (options.full_name) {
    const { firstName: first_name, lastName: last_name } =
      util_getFirstAndLastName(options.full_name ?? 'Anonymous')
    return { first_name, last_name }
  } else {
    return { first_name: 'Anonymous', last_name: '' }
  }
}
