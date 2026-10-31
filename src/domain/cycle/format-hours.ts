export function formatHours(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0
  const minutes = Math.round(safe / 60)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  const hourText = hours > 99 ? String(hours) : String(hours).padStart(2, '0')
  return `${hourText}:${String(rest).padStart(2, '0')}`
}
