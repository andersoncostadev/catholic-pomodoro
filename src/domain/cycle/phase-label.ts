import type { Phase } from '@domain/models/cycle/phase'

export function phaseLabel(phase: Phase): string {
  if (phase === 'offering') return 'Oração'
  if (phase === 'focus') return 'Foco'
  if (phase === 'longPause') return 'Pausa longa'
  return 'Pausa'
}
