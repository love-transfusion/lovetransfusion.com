
/**
 *
 * @param created_at `Date`
 * @returns
 */

import { utils_dateAndTime_subtractDateTime } from "./subtractDateTime"

export const utils_dateAndTime_getPastTime = (created_at: Date) => {
  const subtractedTime = utils_dateAndTime_subtractDateTime(created_at, new Date())
  if (parseInt(subtractedTime.years) > 0) {
    return `${parseInt(subtractedTime.years)} yr ago`
  } else if (parseInt(subtractedTime.months) > 0) {
    return `${parseInt(subtractedTime.months)} mo ago`
  } else if (parseInt(subtractedTime.weeks) > 0) {
    return `${parseInt(subtractedTime.weeks)} wk ago`
  } else if (parseInt(subtractedTime.days) > 0) {
    return `${parseInt(subtractedTime.days)} day ago`
  } else if (parseInt(subtractedTime.hours) > 0) {
    return `${parseInt(subtractedTime.hours)} hr ago`
  } else if (parseInt(subtractedTime.minutes) > 0) {
    return `${parseInt(subtractedTime.minutes)} min ago`
  } else {
    return `${parseInt(subtractedTime.seconds)} sec ago`
  }
}