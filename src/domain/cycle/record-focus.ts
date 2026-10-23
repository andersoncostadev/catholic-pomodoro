import { todayKey } from '@domain/cycle/today-key'
import { yesterdayKey } from '@domain/cycle/yesterday-key'
import { normalizeStats } from '@domain/cycle/normalize-stats'
import type { FocusRecord } from '@domain/models/cycle/focus-record'
import type { Stats } from '@domain/models/cycle/stats'

export function recordFocus(stats: Stats, longPauseEnabled: boolean, date = new Date()): FocusRecord {
  const base = normalizeStats(stats, date)
  const today = todayKey(date)
  const streak = base.lastFocusDate === today ? base.streak : base.lastFocusDate === yesterdayKey(date) ? base.streak + 1 : 1
  const cycle = base.cycleFocusCount + 1
  const wrapped = longPauseEnabled && cycle >= 4
  return {
    wrapped,
    stats: {
      ...base,
      streak,
      lastFocusDate: today,
      focusToday: base.focusToday + 1,
      cycleFocusCount: wrapped || cycle % 4 === 0 ? 0 : cycle % 4,
    },
  }
}
