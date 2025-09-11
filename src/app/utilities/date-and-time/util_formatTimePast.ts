export function util_formatTimePast(created_at: string | Date | null): string {
  if (!created_at) return ''

  const now = Date.now()
  const created = new Date(created_at).getTime()
  if (created > now) return 'in the future'

  const diffMs = now - created

  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))
  const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60
  const seconds = Math.floor(diffMs / 1000) % 60

  if (years > 0) {
    return `${years} year${years === 1 ? '' : 's'} ago`
  } else if (months > 0) {
    return `${months} month${months === 1 ? '' : 's'} ago`
  } else if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`
  } else if (hours > 0) {
    return `${hours} hr${hours === 1 ? '' : 's'} ago`
  } else if (minutes > 0) {
    return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  } else if (seconds > 0) {
    return 'just now'
  } else {
    return 'just now'
  }
}
