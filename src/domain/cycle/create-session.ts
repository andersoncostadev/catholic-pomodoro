import { durationSec } from '@domain/cycle/duration-sec'
import type { Phase } from '@domain/models/cycle/phase'
import type { Session } from '@domain/models/cycle/session'
import type { Settings } from '@domain/models/cycle/settings'

export function createSession(settings: Settings, phase: Phase = 'offering', entryId = 1): Session {
  const sec = durationSec(phase, settings)
  return {
    phase,
    running: false,
    endsAt: null,
    remainingSec: sec,
    plannedSec: sec,
    entryId,
  }
}
