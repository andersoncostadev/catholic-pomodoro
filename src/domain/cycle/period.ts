import { todayKey } from '@domain/cycle/today-key'

export const keptDayCount = 62

export type PeriodKind = 'week' | 'month'

export type Period = {
  kind: PeriodKind
  start: string
  end: string
}

export function parseDayKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  next.setDate(next.getDate() + days)
  return next
}

export function journalCutoff(date = new Date()): string {
  return todayKey(addDays(date, -(keptDayCount - 1)))
}

function startOfWeek(date: Date): Date {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const weekday = day.getDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  day.setDate(day.getDate() + mondayOffset)
  return day
}

export function periodContaining(date: Date, kind: PeriodKind): Period {
  if (kind === 'week') {
    const start = startOfWeek(date)
    return { kind: 'week', start: todayKey(start), end: todayKey(addDays(start, 6)) }
  }
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return { kind: 'month', start: todayKey(start), end: todayKey(end) }
}

export function shiftPeriod(period: Period, direction: -1 | 1): Period {
  if (period.kind === 'week') {
    const start = addDays(parseDayKey(period.start), direction * 7)
    return { kind: 'week', start: todayKey(start), end: todayKey(addDays(start, 6)) }
  }
  const cursor = parseDayKey(period.start)
  return periodContaining(new Date(cursor.getFullYear(), cursor.getMonth() + direction, 1), 'month')
}

export function canShowPeriod(period: Period, today = new Date()): boolean {
  const current = periodContaining(today, period.kind)
  if (period.start > current.start) return false
  const cutoff = journalCutoff(today)
  const todayText = todayKey(today)
  return period.end >= cutoff && period.start <= todayText
}

export function periodForKind(current: Period, kind: PeriodKind, today = new Date()): Period {
  if (current.kind === kind) return current
  const todayText = todayKey(today)
  const anchor = current.start <= todayText && current.end >= todayText ? today : parseDayKey(current.start)
  const next = periodContaining(anchor, kind)
  if (canShowPeriod(next, today)) return next
  return periodContaining(today, kind)
}

export function periodLabel(period: Period): string {
  const start = parseDayKey(period.start)
  if (period.kind === 'month') {
    const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(start)
    return label.charAt(0).toLocaleUpperCase('pt-BR') + label.slice(1)
  }
  const format = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' })
  return `${format.format(start)} – ${format.format(parseDayKey(period.end))}`
}

export function daysOf(period: Period): string[] {
  const days: string[] = []
  let cursor = parseDayKey(period.start)
  const end = period.end
  for (let guard = 0; guard < 40 && todayKey(cursor) <= end; guard += 1) {
    days.push(todayKey(cursor))
    cursor = addDays(cursor, 1)
  }
  return days
}
