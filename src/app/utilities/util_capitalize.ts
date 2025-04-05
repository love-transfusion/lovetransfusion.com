import { util_capitalizeFirstLetter } from './util_capitalizeFirstLetter'

export const util_capitalize = (text: string) => {
  const theString = text?.split(' ')
  const newStr = theString
    ?.map((word) => util_capitalizeFirstLetter(word))
    ?.join(' ')
  return newStr
}
