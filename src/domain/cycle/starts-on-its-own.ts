import type { Phase } from '@domain/models/cycle/phase'

export function startsOnItsOwn(finished: Phase, autoAdvance: boolean, delayMs: number): boolean {
  if (!autoAdvance) return false
  if (delayMs > 2000) return false
  return finished !== 'offering'
}
