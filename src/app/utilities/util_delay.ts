/**
 *
 * @param ms
 * ```
 * type ms = number // in seconds
 * ```
 */
export const util_delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms * 1000))
