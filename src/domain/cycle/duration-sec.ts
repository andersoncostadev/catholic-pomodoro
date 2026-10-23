import type { Phase } from '@domain/models/cycle/phase'
import type { Settings } from '@domain/models/cycle/settings'

export function durationSec(phase: Phase, settings: Settings): number {
  const min =
    phase === 'offering'
      ? settings.offeringMin
      : phase === 'focus'
        ? settings.focusMin
        : phase === 'longPause'
          ? settings.longPauseMin
          : settings.pauseMin
  return Math.max(1, min) * 60
}
