import type { Accent } from '@domain/models/cycle/accent'
import type { PauseKind } from '@domain/models/cycle/pause-kind'
import type { ThemeName } from '@domain/models/cycle/theme-name'

export type Settings = {
  offeringMin: number
  focusMin: number
  pauseMin: number
  longPauseMin: number
  autoAdvance: boolean
  sound: boolean
  soundVolume: number
  repeatBell: boolean
  warnTwoMinutes: boolean
  longPauseEnabled: boolean
  pauseKind: PauseKind
  accent: Accent
  theme: ThemeName
}

export const defaultSettings: Settings = {
  offeringMin: 1,
  focusMin: 25,
  pauseMin: 5,
  longPauseMin: 15,
  autoAdvance: true,
  sound: true,
  soundVolume: 100,
  repeatBell: false,
  warnTwoMinutes: false,
  longPauseEnabled: true,
  pauseKind: 'decade',
  accent: 'gold',
  theme: 'capela',
}
