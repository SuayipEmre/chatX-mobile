export const formatLastSeen = (dateString: string) => {
  const lastSeen = new Date(dateString)
  const now = new Date()

  const diffMs = now.getTime() - lastSeen.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  const isToday =
    lastSeen.toDateString() === now.toDateString()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)

  const isYesterday =
    lastSeen.toDateString() === yesterday.toDateString()

  if (diffHours < 24 && isToday) {
    return `Last seen at ${lastSeen.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}`
  }

  if (isYesterday) {
    return `Last seen yesterday at ${lastSeen.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}`
  }

  return `Last seen on ${lastSeen.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })}`
}
