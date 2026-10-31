import { journalCutoff } from '@domain/cycle/period'
import { todayKey } from '@domain/cycle/today-key'
import type { JournalDay, JournalOffering } from '@domain/models/cycle/journal'

const maxDaySeconds = 60 * 60 * 48

export function recordJournal(
  journal: JournalDay[],
  input: { date?: Date; seconds: number; offering: Pick<JournalOffering, 'id' | 'name'> },
): JournalDay[] {
  const date = input.date ?? new Date()
  const seconds = Math.max(0, Math.round(input.seconds))
  if (seconds <= 0) return pruneJournal(journal, date)

  const key = todayKey(date)
  const next = journal.map((day) => ({ ...day, offerings: day.offerings.map((offering) => ({ ...offering })) }))
  let day = next.find((item) => item.date === key)
  if (!day) {
    day = { date: key, seconds: 0, offerings: [] }
    next.push(day)
  }
  day.seconds = Math.min(maxDaySeconds, day.seconds + seconds)
  const existing = day.offerings.find((item) => item.id === input.offering.id)
  if (existing) {
    existing.seconds = Math.min(maxDaySeconds, existing.seconds + seconds)
    existing.entries += 1
    existing.name = input.offering.name
  } else {
    day.offerings.push({
      id: input.offering.id,
      name: input.offering.name,
      seconds: Math.min(maxDaySeconds, seconds),
      entries: 1,
    })
  }
  return pruneJournal(next, date)
}

export function pruneJournal(journal: JournalDay[], date = new Date()): JournalDay[] {
  const cutoff = journalCutoff(date)
  const today = todayKey(date)
  return journal
    .filter((day) => day.date >= cutoff && day.date <= today && day.seconds > 0)
    .map((day) => ({
      date: day.date,
      seconds: Math.min(maxDaySeconds, day.seconds),
      offerings: day.offerings
        .filter((offering) => offering.seconds > 0)
        .map((offering) => ({
          ...offering,
          seconds: Math.min(maxDaySeconds, offering.seconds),
        })),
    }))
    .sort((left, right) => left.date.localeCompare(right.date))
}
