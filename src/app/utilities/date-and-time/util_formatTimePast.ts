import { subtractDateTime } from './subtractDateTime'

export function util_formatTimePast(created_at: string | Date | null): string {
  if (!created_at) return ''

  const now = Date.now()
  const created = new Date(created_at).getTime()
  const diff = subtractDateTime(created, now)

  const days = parseInt(diff.days)
  const hours = parseInt(diff.hours)
  const minutes = parseInt(diff.minutes)
  const seconds = parseInt(diff.seconds)

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`
  } else if (hours > 0) {
    return `${hours}hr ago`
  } else if (minutes > 0) {
    return `${minutes}min ago`
  } else if (seconds > 0) {
    return `just now`
  } else {
    return 'just now'
  }
}
