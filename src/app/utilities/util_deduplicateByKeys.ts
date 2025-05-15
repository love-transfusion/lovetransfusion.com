// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function util_deduplicateByKeys<T extends Record<string, any>>(
  data: T[],
  keys: (keyof T)[]
): T[] {
  const seen = new Set<string>()
  const result: T[] = []

  for (const item of data) {
    const compositeKey = keys.map((key) => item[key]).join('|')
    if (!seen.has(compositeKey)) {
      seen.add(compositeKey)
      result.push(item)
    }
  }

  return result
}