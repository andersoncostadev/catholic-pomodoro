import type { Phase } from '@domain/models/cycle/phase'

export function nextPhaseAfter(phase: Phase, wrapped: boolean): Phase {
  if (phase === 'offering') return 'focus'
  if (phase === 'focus') return wrapped ? 'longPause' : 'pause'
  return 'offering'
}
