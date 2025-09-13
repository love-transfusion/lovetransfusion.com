export const regex = {
  isNumber: (value: string): boolean => {
    const numberOnlyRegex = /^[0-9]+$/
    return numberOnlyRegex.test(value)
  },
  isEmail: (value: string): boolean => {
    const emailRegex = /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i
    return emailRegex.test(value)
  },
}
