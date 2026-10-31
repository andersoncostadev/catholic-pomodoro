import type { Phase } from '@domain/models/cycle/phase'

const twoMinutes = 120

export function twoMinuteBody(phase: Phase): string {
  if (phase === 'focus') return 'Faltam dois minutos de foco.'
  return 'Faltam dois minutos de oração.'
}

export function reachesTwoMinutes(input: {
  enabled: boolean
  plannedSec: number
  previousRemaining: number
  remaining: number
  running: boolean
  alreadyWarned: boolean
}): boolean {
  if (!input.enabled || !input.running || input.alreadyWarned) return false
  if (input.plannedSec <= twoMinutes) return false
  return input.previousRemaining > twoMinutes && input.remaining <= twoMinutes
}
