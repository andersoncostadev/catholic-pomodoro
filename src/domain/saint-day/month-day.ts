export function monthDayOf(dayKey: string): string | null {
  const parts = /^\d{4}-(\d{2})-(\d{2})$/.exec(dayKey)
  return parts ? `${parts[1]}-${parts[2]}` : null
}
