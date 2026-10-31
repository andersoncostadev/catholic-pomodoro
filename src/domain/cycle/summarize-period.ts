import { formatHours } from '@domain/cycle/format-hours'
import { daysOf, parseDayKey, type Period } from '@domain/cycle/period'
import type { JournalDay } from '@domain/models/cycle/journal'

const weekdayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const minimumShare = 0.08

export type DayBar = {
  key: string
  label: string
  seconds: number
  share: number
  accessibleName: string
}

export type PeriodSummary = {
  hoursLabel: string
  focusDays: number
  bars: DayBar[]
  empty: boolean
  scaleHours: boolean
}

export function summarizePeriod(journal: JournalDay[], period: Period): PeriodSummary {
  const byDate = new Map(journal.map((day) => [day.date, day.seconds]))
  const days = daysOf(period)
  const seconds = days.map((key) => byDate.get(key) ?? 0)
  const total = seconds.reduce((sum, value) => sum + value, 0)
  const peak = seconds.reduce((max, value) => Math.max(max, value), 0)
  const scale = peak > 0 ? peak : 60 * 60
  const bars = days.map((key, index) => {
    const value = seconds[index] ?? 0
    const share = value > 0 ? Math.min(1, Math.max(value / scale, minimumShare)) : 0
    const label = period.kind === 'week' ? (weekdayLabels[index] ?? '') : String(parseDayKey(key).getDate())
    const accessibleName = value > 0 ? `${label}, ${formatHours(value)}` : `${label}, sem foco`
    return { key, label, seconds: value, share, accessibleName }
  })
  return {
    hoursLabel: formatHours(total),
    focusDays: seconds.filter((value) => value > 0).length,
    bars,
    empty: peak === 0,
    scaleHours: peak === 0,
  }
}
