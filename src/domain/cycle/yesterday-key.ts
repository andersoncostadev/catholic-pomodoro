import { todayKey } from '@domain/cycle/today-key'

export function yesterdayKey(date = new Date()): string {
  const copy = new Date(date)
  copy.setDate(copy.getDate() - 1)
  return todayKey(copy)
}
