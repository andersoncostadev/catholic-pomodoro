import { todayKey } from '@domain/cycle/today-key'
import { yesterdayKey } from '@domain/cycle/yesterday-key'
import type { Stats } from '@domain/models/cycle/stats'

export function normalizeStats(stats: Stats, date = new Date()): Stats {
  const today = todayKey(date)
  const yesterday = yesterdayKey(date)
  const daily =
    stats.today === today
      ? stats
      : {
          ...stats,
          today,
          focusToday: 0,
          offeringsToday: 0,
          pausesToday: 0,
          cycleFocusCount: 0,
        }

  if (!daily.lastFocusDate) return { ...daily, streak: 0 }
  if (daily.lastFocusDate === today || daily.lastFocusDate === yesterday) return daily
  return { ...daily, streak: 0 }
}
