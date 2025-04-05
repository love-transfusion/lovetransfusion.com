'use server'

export const util_getUUID = async (inputUrl: string) => {
  const uuidRegex =
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i
  const match = inputUrl.match(uuidRegex)
  return match ? match[0] : null
}
