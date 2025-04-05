export const util_formatDateToUTCString = (paramDate: Date) => {
  const date = new Date(paramDate)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Pad month for single digit
  const day = String(date.getUTCDate()).padStart(2, '0') // Pad day for single digit

  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0') // Pad milliseconds

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`
}
