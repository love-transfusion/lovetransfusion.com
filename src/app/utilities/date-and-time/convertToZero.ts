// Example: 01/03/23
/**
 * @param initial number
 * @returns `string`
 */
export const utils_dateAndTime_convertToZeroFirst = (initial: number) => {
  if (initial < 10) {
    const newInitial = `0${initial}`
    return newInitial
  }
  return `${initial}`
}