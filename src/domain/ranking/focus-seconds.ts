export const rankingFocusMaxSeconds = 5400
export const rankingDayMaxSeconds = 57600
export const rankingHourMaxPosts = 30

export function focusSecondsOrNull(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null
  if (value < 1 || value > rankingFocusMaxSeconds) return null
  return value
}
