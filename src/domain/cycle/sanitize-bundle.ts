import { durationSec } from '@domain/cycle/duration-sec'
import { normalizeStats } from '@domain/cycle/normalize-stats'
import { todayKey } from '@domain/cycle/today-key'
import type { Bundle } from '@domain/models/cycle/bundle'
import type { Phase } from '@domain/models/cycle/phase'
import type { Session } from '@domain/models/cycle/session'
import { defaultSettings, type Settings } from '@domain/models/cycle/settings'
import type { Stats } from '@domain/models/cycle/stats'
import type { Task } from '@domain/models/cycle/task'

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}

function isPhase(value: unknown): value is Phase {
  return value === 'offering' || value === 'focus' || value === 'pause' || value === 'longPause'
}

export function sanitizeBundle(raw: unknown): Bundle {
  const source = raw && typeof raw === 'object' ? (raw as Partial<Bundle>) : {}
  const incoming = source.settings ?? ({} as Partial<Settings>)
  const settings: Settings = {
    offeringMin: clampInt(incoming.offeringMin, 1, 15, defaultSettings.offeringMin),
    focusMin: clampInt(incoming.focusMin, 5, 90, defaultSettings.focusMin),
    pauseMin: clampInt(incoming.pauseMin, 1, 30, defaultSettings.pauseMin),
    longPauseMin: clampInt(incoming.longPauseMin, 5, 45, defaultSettings.longPauseMin),
    autoAdvance: incoming.autoAdvance !== false,
    sound: incoming.sound !== false,
    longPauseEnabled: incoming.longPauseEnabled !== false,
    pauseKind: incoming.pauseKind === 'brief' || incoming.pauseKind === 'presence' ? incoming.pauseKind : 'decade',
    accent:
      incoming.accent === 'rose' ||
      incoming.accent === 'blue' ||
      incoming.accent === 'coral' ||
      incoming.accent === 'menta' ||
      incoming.accent === 'lima' ||
      incoming.accent === 'brisa' ||
      incoming.accent === 'manto'
        ? incoming.accent
        : 'gold',
    theme: incoming.theme === 'alvorada' || incoming.theme === 'noite' ? incoming.theme : 'capela',
  }

  const tasks = Array.isArray(source.tasks)
    ? source.tasks.flatMap((item) => {
        if (!item || typeof item !== 'object') return []
        const task = item as Partial<Task>
        if (typeof task.id !== 'string' || typeof task.title !== 'string') return []
        const title = task.title.trim()
        if (!title) return []
        return [
          {
            id: task.id,
            title: title.slice(0, 140),
            done: task.done === true,
            focusSeconds: clampInt(task.focusSeconds, 0, 60 * 60 * 24 * 30, 0),
          },
        ]
      })
    : []

  const selectedTaskId =
    typeof source.selectedTaskId === 'string' && tasks.some((task) => task.id === source.selectedTaskId && !task.done)
      ? source.selectedTaskId
      : null

  const statsIn = source.stats ?? ({} as Partial<Stats>)
  const stats = normalizeStats({
    streak: clampInt(statsIn.streak, 0, 10000, 0),
    lastFocusDate: typeof statsIn.lastFocusDate === 'string' ? statsIn.lastFocusDate : null,
    today: typeof statsIn.today === 'string' ? statsIn.today : todayKey(),
    focusToday: clampInt(statsIn.focusToday, 0, 500, 0),
    offeringsToday: clampInt(statsIn.offeringsToday, 0, 500, 0),
    pausesToday: clampInt(statsIn.pausesToday, 0, 500, 0),
    cycleFocusCount: clampInt(statsIn.cycleFocusCount, 0, 3, 0),
  })

  const sessionIn = source.session
  const phase = sessionIn && isPhase(sessionIn.phase) ? sessionIn.phase : 'offering'
  const total = durationSec(phase, settings)
  const session: Session = {
    phase,
    running: sessionIn?.running === true && typeof sessionIn.endsAt === 'number',
    endsAt: sessionIn?.running === true && typeof sessionIn.endsAt === 'number' ? sessionIn.endsAt : null,
    remainingSec: clampInt(sessionIn?.remainingSec, 0, total, total),
    plannedSec: clampInt(sessionIn?.plannedSec, 1, total, total),
    entryId: clampInt(sessionIn?.entryId, 1, 1_000_000, 1),
  }
  if (!session.running) session.endsAt = null

  return {
    settings,
    tasks,
    selectedTaskId,
    stats,
    session,
    intention: typeof source.intention === 'string' ? source.intention.slice(0, 180) : '',
    quoteIndex: clampInt(source.quoteIndex, 0, 1000, 0),
  }
}
