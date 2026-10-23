import type { Phase } from '@domain/models/cycle/phase'

export type Session = {
  phase: Phase
  running: boolean
  endsAt: number | null
  remainingSec: number
  plannedSec: number
  entryId: number
}
