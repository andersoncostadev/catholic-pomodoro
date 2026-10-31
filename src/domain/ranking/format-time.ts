import { formatHours } from '../cycle/format-hours'

export function formatRankingTime(totalSeconds: number): string {
  return formatHours(totalSeconds)
}
