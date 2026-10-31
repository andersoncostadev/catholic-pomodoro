import { useEffect, useRef, useState } from 'react'
import { durationSec } from '@domain/cycle/duration-sec'
import { elapsedSec } from '@domain/cycle/elapsed-sec'
import { nextPhaseAfter } from '@domain/cycle/next-phase-after'
import { normalizeStats } from '@domain/cycle/normalize-stats'
import { noticeFor } from '@domain/cycle/notice-for'
import { recordFocus } from '@domain/cycle/record-focus'
import { recordJournal } from '@domain/cycle/record-journal'
import { remainingOf } from '@domain/cycle/remaining-of'
import { startsOnItsOwn } from '@domain/cycle/starts-on-its-own'
import { reachesTwoMinutes, twoMinuteBody } from '@domain/cycle/two-minute-warning'
import { unnamedOfferingName } from '@domain/models/cycle/journal'
import type { Bundle } from '@domain/models/cycle/bundle'
import type { Phase } from '@domain/models/cycle/phase'
import type { Session } from '@domain/models/cycle/session'
import type { Settings } from '@domain/models/cycle/settings'
import type { Task } from '@domain/models/cycle/task'
import { askNotification, notifyIfHidden } from '@main/factories/browser/notifications'
import { playBell, unlockAudio } from '@main/factories/browser/audio-bell'
import { makeLoadBundle } from '@main/factories/usecases/cycle/load-bundle'
import { makeSaveBundle } from '@main/factories/usecases/cycle/save-bundle'

const loadBundle = makeLoadBundle()
const saveBundle = makeSaveBundle()
const initial = loadBundle.handle()

const handledDeadlines = new Set<number>()

function alreadyHandled(endsAt: number): boolean {
  return handledDeadlines.has(endsAt)
}

function markHandled(endsAt: number): void {
  handledDeadlines.add(endsAt)
}

export function usePomodoro() {
  const [settings, setSettingsState] = useState(initial.settings)
  const [tasks, setTasks] = useState<Task[]>(initial.tasks)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initial.selectedTaskId)
  const [stats, setStats] = useState(initial.stats)
  const [session, setSession] = useState<Session>(initial.session)
  const [intention, setIntention] = useState(initial.intention)
  const [quoteIndex, setQuoteIndex] = useState(initial.quoteIndex)
  const [journal, setJournal] = useState(initial.journal)
  const [notice, setNotice] = useState<string | null>(null)
  const [leavePhase, setLeavePhase] = useState<Phase | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const snap = useRef<Bundle>(initial)
  const warnedEntry = useRef<number | null>(null)
  const previousRemaining = useRef<number | null>(null)
  snap.current = { settings, tasks, selectedTaskId, stats, session, intention, quoteIndex, journal }

  useEffect(() => {
    saveBundle.handle(snap.current)
  }, [settings, tasks, selectedTaskId, stats, session, intention, quoteIndex, journal])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const today = normalizeStats(stats).today
    if (today !== stats.today || normalizeStats(stats).streak !== stats.streak) {
      setStats((current) => normalizeStats(current))
    }
  }, [now, stats])

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), 7000)
    return () => window.clearTimeout(id)
  }, [notice])

  useEffect(() => {
    if (!session.running || session.endsAt == null) return
    if (now < session.endsAt) return
    if (alreadyHandled(session.endsAt)) return
    finishPhase(session.endsAt)
  }, [now, session.running, session.endsAt])

  function finishPhase(endsAt: number) {
    const current = snap.current
    if (!current.session.running || current.session.endsAt !== endsAt) return
    if (alreadyHandled(endsAt)) return
    settlePhase()
  }

  function endFocus() {
    const current = snap.current
    if (current.session.phase !== 'focus') return
    if (elapsedSec(current.session, Date.now()) < 1) return
    if (current.session.endsAt != null && alreadyHandled(current.session.endsAt)) return
    settlePhase()
  }

  function settlePhase() {
    const current = snap.current
    const endsAt = current.session.endsAt
    if (endsAt != null) {
      if (alreadyHandled(endsAt)) return
      markHandled(endsAt)
    }

    const finished = current.session.phase
    let nextStats = normalizeStats(current.stats)
    let nextTasks = current.tasks
    let nextJournal = current.journal
    let wrapped = false

    if (finished === 'offering') {
      nextStats = { ...nextStats, offeringsToday: nextStats.offeringsToday + 1 }
    } else if (finished === 'focus') {
      const recorded = recordFocus(nextStats, current.settings.longPauseEnabled)
      nextStats = recorded.stats
      wrapped = recorded.wrapped
      const spent = elapsedSec(current.session, Date.now())
      const selected = current.tasks.find((task) => task.id === current.selectedTaskId)
      nextJournal = recordJournal(current.journal, {
        seconds: spent,
        offering: selected ? { id: selected.id, name: selected.title } : { id: null, name: unnamedOfferingName },
      })
      if (selected) {
        nextTasks = current.tasks.map((task) =>
          task.id === selected.id ? { ...task, focusSeconds: task.focusSeconds + spent, focusCount: task.focusCount + 1 } : task,
        )
      }
    } else {
      nextStats = { ...nextStats, pausesToday: nextStats.pausesToday + 1 }
    }

    const nextPhase = nextPhaseAfter(finished, wrapped)
    const delayMs = endsAt == null ? 0 : Date.now() - endsAt
    const auto = startsOnItsOwn(finished, current.settings.autoAdvance, delayMs)
    const sec = durationSec(nextPhase, current.settings)
    const nextSession: Session = {
      phase: nextPhase,
      running: auto,
      endsAt: auto ? Date.now() + sec * 1000 : null,
      remainingSec: sec,
      plannedSec: sec,
      entryId: current.session.entryId + 1,
    }
    const message = noticeFor(finished)

    saveBundle.handle({ ...current, stats: nextStats, tasks: nextTasks, session: nextSession, journal: nextJournal })
    setStats(nextStats)
    setTasks(nextTasks)
    setJournal(nextJournal)
    setSession(nextSession)
    setNotice(message)
    setLeavePhase(null)
    if (current.settings.sound) playBell(current.settings.soundVolume, current.settings.repeatBell)
    notifyIfHidden(message)
  }

  function toggle() {
    const current = snap.current.session
    const currentSettings = snap.current.settings
    if (current.running && current.endsAt != null) {
      const remainingSec = Math.max(0, Math.ceil((current.endsAt - Date.now()) / 1000))
      setSession({ ...current, running: false, endsAt: null, remainingSec })
      return
    }
    unlockAudio()
    askNotification()
    const remainingSec = current.remainingSec > 0 ? current.remainingSec : durationSec(current.phase, currentSettings)
    setSession({
      ...current,
      running: true,
      remainingSec,
      plannedSec: current.plannedSec || remainingSec,
      endsAt: Date.now() + remainingSec * 1000,
    })
  }

  function reset() {
    const current = snap.current
    const sec = durationSec(current.session.phase, current.settings)
    setLeavePhase(null)
    setSession({
      phase: current.session.phase,
      running: false,
      endsAt: null,
      remainingSec: sec,
      plannedSec: sec,
      entryId: current.session.entryId,
    })
  }

  function selectPhase(tab: 'offering' | 'focus' | 'pause') {
    const current = snap.current
    const phase: Phase = tab === 'pause' && current.session.phase === 'longPause' ? 'longPause' : tab
    if (current.session.phase === phase) return
    if (current.session.running) {
      setLeavePhase(phase)
      return
    }
    setLeavePhase(null)
    replacePhase(phase)
  }

  function stayPhase() {
    setLeavePhase(null)
  }

  function confirmLeave() {
    const phase = leavePhase
    if (!phase) return
    setLeavePhase(null)
    replacePhase(phase)
  }

  function replacePhase(phase: Phase) {
    const current = snap.current
    const sec = durationSec(phase, current.settings)
    setSession({
      phase,
      running: false,
      endsAt: null,
      remainingSec: sec,
      plannedSec: sec,
      entryId: current.session.entryId + 1,
    })
  }

  function beginOffering() {
    const current = snap.current
    setLeavePhase(null)
    unlockAudio()
    askNotification()
    const sec = durationSec('offering', current.settings)
    setSession({
      phase: 'offering',
      running: true,
      endsAt: Date.now() + sec * 1000,
      remainingSec: sec,
      plannedSec: sec,
      entryId: current.session.entryId + 1,
    })
  }

  function updateSettings(patch: Partial<Settings>) {
    const prev = snap.current.settings
    const sessionPrev = snap.current.session
    const next = { ...prev, ...patch }
    let nextSession = sessionPrev
    if (!sessionPrev.running) {
      const oldTotal = durationSec(sessionPrev.phase, prev)
      const newTotal = durationSec(sessionPrev.phase, next)
      if (sessionPrev.remainingSec === oldTotal) {
        nextSession = { ...sessionPrev, remainingSec: newTotal, plannedSec: newTotal }
      }
    }
    snap.current = { ...snap.current, settings: next, session: nextSession }
    setSettingsState(next)
    if (nextSession !== sessionPrev) setSession(nextSession)
  }

  function addTask(title: string, plannedFocuses = 1) {
    const clean = title.trim()
    if (!clean) return false
    const planned = Math.min(12, Math.max(1, Math.round(plannedFocuses)))
    const task: Task = {
      id: crypto.randomUUID(),
      title: clean.slice(0, 140),
      done: false,
      focusSeconds: 0,
      plannedFocuses: Number.isFinite(planned) ? planned : 1,
      focusCount: 0,
    }
    setTasks((current) => [task, ...current])
    setSelectedTaskId(task.id)
    return true
  }

  function setPlannedFocuses(id: string, plannedFocuses: number) {
    const planned = Math.min(12, Math.max(1, Math.round(plannedFocuses)))
    if (!Number.isFinite(planned)) return
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, plannedFocuses: planned } : task)))
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
    setSelectedTaskId((current) => {
      const task = snap.current.tasks.find((item) => item.id === id)
      if (current === id && task && !task.done) return null
      return current
    })
  }

  function removeTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
    setSelectedTaskId((current) => (current === id ? null : current))
  }

  function clearDone() {
    setTasks((current) => current.filter((task) => !task.done))
  }

  const remaining = remainingOf(session, Date.now())
  const elapsed = elapsedSec(session, Date.now())
  const phaseTotal = durationSec(session.phase, settings)
  const canEndFocus = session.phase === 'focus' && elapsed >= 1

  useEffect(() => {
    const previous = previousRemaining.current
    previousRemaining.current = remaining
    if (previous == null) return
    if (
      !reachesTwoMinutes({
        enabled: settings.warnTwoMinutes,
        plannedSec: session.plannedSec,
        previousRemaining: previous,
        remaining,
        running: session.running,
        alreadyWarned: warnedEntry.current === session.entryId,
      })
    ) {
      return
    }
    warnedEntry.current = session.entryId
    notifyIfHidden(twoMinuteBody(session.phase))
  }, [remaining, session.entryId, session.phase, session.plannedSec, session.running, settings.warnTwoMinutes])

  useEffect(() => {
    if (session.running) {
      document.title = `${formatRunningTitle(remaining, session.phase)}`
    } else {
      document.title = 'Pomodoro Católico'
    }
  }, [remaining, session.running, session.phase])

  return {
    settings,
    updateSettings,
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    addTask,
    setPlannedFocuses,
    toggleTask,
    removeTask,
    clearDone,
    stats,
    journal,
    session,
    remaining,
    elapsed,
    canEndFocus,
    phaseTotal,
    leavePhase,
    intention,
    setIntention,
    quoteIndex,
    nextQuote: () => setQuoteIndex((index) => index + 1),
    notice,
    dismissNotice: () => setNotice(null),
    toggle,
    reset,
    selectPhase,
    stayPhase,
    confirmLeave,
    endFocus,
    beginOffering,
  }
}

function formatRunningTitle(remaining: number, phase: Phase): string {
  const minutes = Math.floor(Math.max(0, remaining) / 60)
  const seconds = Math.max(0, remaining) % 60
  const clock = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const label = phase === 'offering' ? 'Oração' : phase === 'focus' ? 'Foco' : phase === 'longPause' ? 'Pausa longa' : 'Pausa'
  return `${clock} · ${label}`
}

export type PomodoroController = ReturnType<typeof usePomodoro>
