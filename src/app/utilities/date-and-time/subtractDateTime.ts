import { utils_dateAndTime_convertToZeroFirst } from './convertToZero'

export type TimeDifference = {
  years: string
  months: string
  weeks: string
  days: string
  hours: string
  minutes: string
  seconds: string
}

export const subtractDateTime = (
  date1: string | number | Date,
  date2: number
): TimeDifference => {
  const now = new Date(date1)
  const difference = date2 - now.getTime()

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
