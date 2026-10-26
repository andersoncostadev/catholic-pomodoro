import { remainingOf } from '@domain/cycle/remaining-of'
import type { Session } from '@domain/models/cycle/session'

export function elapsedSec(session: Session, now: number): number {
  return Math.max(0, session.plannedSec - remainingOf(session, now))
}
