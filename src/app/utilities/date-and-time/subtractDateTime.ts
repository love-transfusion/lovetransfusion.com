import { utils_dateAndTime_convertToZeroFirst } from './convertToZero'

/**
 * 
 * @param date1 Date
 * @param date2 Date
 * @returns 
 */
export const utils_dateAndTime_subtractDateTime = (
  date1: Date,
  date2: Date
) => {
  const now = new Date(date1).getTime()
  const before = new Date(date2).getTime()
  const difference = before - now

  const initialYears = Math.floor(difference / (1000 * 60 * 60 * 24 * 12 * 30))
  const years = utils_dateAndTime_convertToZeroFirst(initialYears)
  const initialMonths = Math.floor(
    (difference % (1000 * 60 * 60 * 24 * 12 * 30)) / (1000 * 60 * 60 * 24 * 30)
  )
  const months = utils_dateAndTime_convertToZeroFirst(initialMonths)
  const initialWeeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7))
  const weeks = utils_dateAndTime_convertToZeroFirst(initialWeeks)
  const initialDays = Math.floor(
    (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
  )
  const days = utils_dateAndTime_convertToZeroFirst(initialDays)
  const initialHours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const hours = utils_dateAndTime_convertToZeroFirst(initialHours)
  const initialMinutes = Math.floor(
    (difference % (1000 * 60 * 60)) / (1000 * 60)
  )
  const minutes = utils_dateAndTime_convertToZeroFirst(initialMinutes)
  const initialSeconds = Math.floor((difference % (1000 * 60)) / 1000)
  const seconds = utils_dateAndTime_convertToZeroFirst(initialSeconds)

  return { years, months, weeks, days, hours, minutes, seconds }
}
