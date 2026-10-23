import type { Session } from '@domain/models/cycle/session'

export function remainingOf(session: Session, now: number): number {
  if (session.running && session.endsAt != null) {
    return Math.max(0, Math.ceil((session.endsAt - now) / 1000))
  }
  return session.remainingSec
}
