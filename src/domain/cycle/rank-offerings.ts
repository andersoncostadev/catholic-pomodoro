import { formatHours } from '@domain/cycle/format-hours'
import type { Period } from '@domain/cycle/period'
import type { JournalDay } from '@domain/models/cycle/journal'

export type OfferingRank = {
  id: string | null
  position: number
  name: string
  seconds: number
  label: string
}

export function rankOfferings(journal: JournalDay[], period: Period): OfferingRank[] {
  const totals = new Map<string, OfferingRank>()
  const days = journal
    .filter((day) => day.date >= period.start && day.date <= period.end)
    .sort((left, right) => left.date.localeCompare(right.date))

  for (const day of days) {
    for (const offering of day.offerings) {
      const key = offering.id ?? ''
      const current = totals.get(key)
      if (!current) {
        totals.set(key, {
          id: offering.id,
          position: 0,
          name: offering.name,
          seconds: offering.seconds,
          label: '',
        })
        continue
      }
      current.seconds += offering.seconds
      current.name = offering.name
    }
  }

  const rows = [...totals.values()].filter((row) => row.seconds > 0)
  rows.sort((left, right) => right.seconds - left.seconds || left.name.localeCompare(right.name, 'pt'))
  return rows.map((row, index) => ({
    ...row,
    position: index + 1,
    label: formatHours(row.seconds),
  }))
}
