import { todayKey } from '@domain/cycle/today-key'
import type { Stats } from '@domain/models/cycle/stats'

export function createDefaultStats(date = new Date()): Stats {
  return {
    streak: 0,
    lastFocusDate: null,
    today: todayKey(date),
    focusToday: 0,
    offeringsToday: 0,
    pausesToday: 0,
    cycleFocusCount: 0,
  }
}
