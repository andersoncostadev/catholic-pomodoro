import { LiturgyLine } from '@components/Liturgy'
import { SaintDayLine } from '@components/SaintDay'
import { formatClock } from '@domain/cycle/format-clock'
import { phaseLabel } from '@domain/cycle/phase-label'
import { aveMaria, briefPrayers, gloria, jaculatories, mysterySetFor, paiNosso, quotes } from '@domain/catalogs/content'
import type { Phase } from '@domain/models/cycle/phase'
import type { LiturgyDay } from '@domain/models/liturgy/day'
import type { SaintDay } from '@domain/models/saint-day/day'
import type { PomodoroController } from '@main/factories/flows/usePomodoro'
import { useEffect, useRef, useState } from 'react'

const TABS = [
  { id: 'offering', label: 'Oração' },
  { id: 'focus', label: 'Foco' },
  { id: 'pause', label: 'Pausa' },
] as const

export function TimerHero({
  pomodoro,
  liturgy,
  saint,
  onOpenTasks,
  onOpenLiturgy,
  onOpenSaint,
}: {
  pomodoro: PomodoroController
  liturgy: LiturgyDay | null
  saint: SaintDay | null
  onOpenTasks: () => void
  onOpenLiturgy: () => void
  onOpenSaint: () => void
}) {
  const { session, remaining, phaseTotal, stats, settings, tasks, selectedTaskId, quoteIndex, nextQuote, notice, dismissNotice } = pomodoro
  const progress = phaseTotal === 0 ? 0 : Math.min(1, remaining / phaseTotal)
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)
  const task = tasks.find((item) => item.id === selectedTaskId) ?? null
  const quote = quotes[quoteIndex % quotes.length]
  const label = phaseLabel(session.phase)
  const pauseTabLabel = session.phase === 'longPause' ? 'Pausa longa' : 'Pausa'
  const dots = session.phase === 'longPause' ? 4 : stats.cycleFocusCount
  const isFocus = session.phase === 'focus'
  const isPause = session.phase === 'pause' || session.phase === 'longPause'
  const isPresence = isPause && settings.pauseKind === 'presence'
  const quoteFromStart = isPause && settings.pauseKind !== 'decade'
  const stayRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!pomodoro.leavePhase) return
    stayRef.current?.focus()
  }, [pomodoro.leavePhase])

  return (
    <section className="hero" id="timer">
      {liturgy && !isFocus ? <LiturgyLine day={liturgy} onOpen={onOpenLiturgy} /> : null}
      {saint && !isFocus ? <SaintDayLine saint={saint} onOpen={onOpenSaint} /> : null}
      <div className="tabs" role="tablist" aria-label="Fases do ciclo">
        {TABS.map((tab) => {
          const selected = tab.id === 'pause' ? session.phase === 'pause' || session.phase === 'longPause' : session.phase === tab.id
          const count = tab.id === 'offering' ? stats.offeringsToday : tab.id === 'focus' ? stats.focusToday : stats.pausesToday
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              aria-label={count > 0 ? undefined : tab.label}
              className={selected ? 'tab is-on' : 'tab'}
              onClick={() => pomodoro.selectPhase(tab.id)}
            >
              {tab.id === 'pause' ? pauseTabLabel : tab.label}
              {count > 0 ? <span>{count}</span> : null}
            </button>
          )
        })}
      </div>
      {pomodoro.leavePhase ? (
        <div className="leave" role="group" aria-label="Sair desta fase? O tempo em curso não fica registrado.">
          <p>Sair desta fase? O tempo em curso não fica registrado.</p>
          <div className="leave-actions">
            <button type="button" className="primary" ref={stayRef} onClick={pomodoro.stayPhase}>
              Ficar
            </button>
            <button type="button" className="leave-go" onClick={pomodoro.confirmLeave}>
              Sair mesmo assim
            </button>
          </div>
        </div>
      ) : null}

      <div
        className="dial"
        role="timer"
        aria-label={`${formatClock(remaining)} restantes na fase ${label}`}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle className="dial-track" cx="50" cy="50" r={radius} />
          <circle
            className="dial-value"
            cx="50"
            cy="50"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="dial-copy">
          <strong>{formatClock(remaining)}</strong>
          <em>
            {session.running ? <i className="live" /> : null}
            {label}
          </em>
        </div>
      </div>

      <div className="cycle" aria-label={`${dots} de 4 focos neste ciclo`}>
        {[0, 1, 2, 3].map((index) => (
          <i key={index} className={index < dots ? 'is-on' : ''} />
        ))}
        <span className="cycle-count">{dots} de 4</span>
      </div>

      <div className="controls">
        <button type="button" className="primary" onClick={pomodoro.toggle}>
          {session.running ? 'Pausar' : startLabel(session.phase)}
        </button>
        <button type="button" className="icon-btn" onClick={pomodoro.reset} aria-label="Reiniciar esta fase">
          <ResetIcon />
        </button>
      </div>
      {pomodoro.canEndFocus ? (
        <button type="button" className="text-btn end-focus" onClick={pomodoro.endFocus}>
          Encerrar este foco
        </button>
      ) : null}

      {notice ? (
        <p className="notice" role="status">
          {notice}
          <button type="button" onClick={dismissNotice} aria-label="Fechar aviso">
            ×
          </button>
        </p>
      ) : null}

      {isFocus || isPresence ? null : <p className="hint">{nextHint(session.phase, settings, stats.cycleFocusCount)}</p>}

      <PhaseGuide
        phase={session.phase}
        entryId={session.entryId}
        pauseKind={settings.pauseKind}
        longPause={settings.longPauseEnabled}
        focusToday={stats.focusToday}
        cycleFocusCount={stats.cycleFocusCount}
        offeringsToday={stats.offeringsToday}
        taskTitle={task?.title ?? null}
        intention={pomodoro.intention}
        onOpenTasks={onOpenTasks}
        quote={isPause && settings.pauseKind === 'decade' ? quote : null}
        onNextQuote={nextQuote}
      />

      {quoteFromStart ? <QuoteBlock quote={quote} onNext={nextQuote} /> : null}

      {isFocus ? null : (
        <a className="down" href="#metodo" aria-label="Rolar para o método">
          <span />
        </a>
      )}
    </section>
  )
}

function startLabel(phase: Phase): string {
  if (phase === 'offering') return 'Começar a oração'
  if (phase === 'focus') return 'Começar o foco'
  if (phase === 'longPause') return 'Começar a pausa longa'
  return 'Começar a pausa'
}

function nextHint(
  phase: Phase,
  settings: PomodoroController['settings'],
  cycleFocusCount: number,
): string {
  if (phase === 'offering') return `Depois, ${settings.focusMin} min de foco`
  if (phase === 'focus') {
    const closing = settings.longPauseEnabled && cycleFocusCount === 3
    return closing ? `Depois, ${settings.longPauseMin} min de pausa longa` : `Depois, ${settings.pauseMin} min de oração`
  }
  return `Depois, ${settings.offeringMin} min de oração`
}

function PhaseGuide({
  phase,
  entryId,
  pauseKind,
  longPause,
  focusToday,
  cycleFocusCount,
  offeringsToday,
  taskTitle,
  intention,
  onOpenTasks,
  quote,
  onNextQuote,
}: {
  phase: Phase
  entryId: number
  pauseKind: PomodoroController['settings']['pauseKind']
  longPause: boolean
  focusToday: number
  cycleFocusCount: number
  offeringsToday: number
  taskTitle: string | null
  intention: string
  onOpenTasks: () => void
  quote: { text: string; author: string } | null
  onNextQuote: () => void
}) {
  if (phase === 'offering') {
    return (
      <Jaculatory
        entryId={entryId}
        offeringsToday={offeringsToday}
        taskTitle={taskTitle}
        intention={intention}
        onOpenTasks={onOpenTasks}
      />
    )
  }

  if (phase === 'focus') {
    return (
      <article className="guide guide-quiet">
        <h2>{taskTitle ?? 'Uma coisa de cada vez.'}</h2>
      </article>
    )
  }

  return (
    <PauseGuide
      entryId={entryId}
      kind={pauseKind}
      long={phase === 'longPause'}
      longEnabled={longPause}
      focusToday={focusToday}
      cycleFocusCount={cycleFocusCount}
      quote={quote}
      onNextQuote={onNextQuote}
    />
  )
}

function QuoteBlock({ quote, onNext }: { quote: { text: string; author: string }; onNext: () => void }) {
  return (
    <figure className="quote">
      <blockquote>“{quote.text}”</blockquote>
      <figcaption>{quote.author}</figcaption>
      <button type="button" onClick={onNext}>
        Outra frase
      </button>
    </figure>
  )
}

function Jaculatory({
  entryId,
  offeringsToday,
  taskTitle,
  intention,
  onOpenTasks,
}: {
  entryId: number
  offeringsToday: number
  taskTitle: string | null
  intention: string
  onOpenTasks: () => void
}) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    setOffset(0)
  }, [entryId])
  const line = jaculatories[(offeringsToday + offset) % jaculatories.length]

  return (
    <article className="guide">
      <p className="guide-kicker">Jaculatória</p>
      <h2>{line}</h2>
      <button type="button" className="text-btn" onClick={() => setOffset((value) => value + 1)}>
        Outra jaculatória
      </button>
      {taskTitle ? <p className="guide-offer">Ofereço: {taskTitle}</p> : null}
      {intention ? <p className="guide-offer">{intention}</p> : null}
      {taskTitle ? null : (
        <button type="button" className="offer-ask" onClick={onOpenTasks}>
          O que você oferece hoje?
        </button>
      )}
    </article>
  )
}

function PauseGuide({
  entryId,
  kind,
  long,
  longEnabled,
  focusToday,
  cycleFocusCount,
  quote,
  onNextQuote,
}: {
  entryId: number
  kind: PomodoroController['settings']['pauseKind']
  long: boolean
  longEnabled: boolean
  focusToday: number
  cycleFocusCount: number
  quote: { text: string; author: string } | null
  onNextQuote: () => void
}) {
  const { set, weekday } = mysterySetFor()
  const index = mysteryIndex(long, longEnabled, focusToday, cycleFocusCount)
  const mystery = set.items[index]
  const fifth = long ? set.items[4] : null

  const typeName = kind === 'decade' ? 'Dezena' : kind === 'brief' ? 'Oração breve' : null

  return (
    <article className={kind === 'presence' ? 'guide guide-quiet' : 'guide'}>
      {typeName ? <p className="guide-kicker">{typeName}</p> : null}
      {kind === 'decade' ? (
        <Decade
          entryId={entryId}
          setName={set.name}
          weekday={weekday}
          mystery={mystery.title}
          fruit={mystery.fruit}
          fifth={fifth?.title ?? null}
          long={long}
          quote={quote}
          onNextQuote={onNextQuote}
        />
      ) : null}
      {kind === 'brief' ? <BriefPrayer entryId={entryId} long={long} /> : null}
      {kind === 'presence' ? <h2>{long ? 'Quinze minutos na presença de Deus.' : 'Permaneça na presença de Deus.'}</h2> : null}
    </article>
  )
}

function mysteryIndex(long: boolean, longEnabled: boolean, focusToday: number, cycleFocusCount: number): number {
  if (long) return 3
  if (!longEnabled) return focusToday <= 0 ? 0 : (focusToday - 1) % 5
  return cycleFocusCount <= 0 ? 0 : cycleFocusCount - 1
}

function Decade({
  entryId,
  setName,
  weekday,
  mystery,
  fruit,
  fifth,
  long,
  quote,
  onNextQuote,
}: {
  entryId: number
  setName: string
  weekday: string
  mystery: string
  fruit: string
  fifth: string | null
  long: boolean
  quote: { text: string; author: string } | null
  onNextQuote: () => void
}) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    setStep(0)
  }, [entryId])

  const hail = step >= 2 && step <= 11 ? step - 1 : step > 11 ? 10 : 0
  const label =
    step === 0
      ? 'Quando quiser, comece pelo Pai-Nosso.'
      : step === 1
        ? 'Pai-Nosso'
        : step <= 11
          ? `Ave-Maria ${hail} de 10`
          : step === 12
            ? 'Glória ao Pai'
            : 'Dezena rezada'
  const prayer = step <= 1 ? paiNosso : step <= 11 ? aveMaria : gloria
  const done = step >= 13

  return (
    <>
      <h2>{mystery}</h2>
      <p className="guide-meta">
        {setName} · {weekday}
        <span>Fruto: {fruit}</span>
      </p>
      <p className="bead-label">{label}</p>
      <div className="beads beads-lg" aria-hidden="true">
        <i className={step >= 1 ? 'is-on father' : 'father'} />
        {Array.from({ length: 10 }, (_, index) => (
          <i key={index} className={hail > index ? 'is-on' : ''} />
        ))}
        <i className={step >= 12 ? 'is-on glory' : 'glory'} />
      </div>
      <button type="button" className="text-btn" onClick={() => setStep((value) => Math.min(13, value + 1))} disabled={done}>
        {step === 0 ? 'Começar a dezena' : done ? 'Dezena rezada' : 'Rezei esta conta'}
      </button>
      {done && quote ? <QuoteBlock quote={quote} onNext={onNextQuote} /> : null}
      <details>
        <summary>Ver a oração</summary>
        <p>{prayer}</p>
      </details>
      {long && fifth ? <p className="guide-meta">Se sobrar tempo, siga com o quinto mistério: {fifth}.</p> : null}
      {long ? <p>Ou faça um exame breve e permaneça em silêncio.</p> : null}
    </>
  )
}

function BriefPrayer({ entryId, long }: { entryId: number; long: boolean }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    setIndex(0)
  }, [entryId])
  const prayer = briefPrayers[index % briefPrayers.length]
  return (
    <>
      <h2>{prayer.title}</h2>
      <p className="prayer-line">{prayer.text}</p>
      {long ? <p>Nesta pausa mais longa, pode repetir devagar ou ficar em silêncio depois.</p> : null}
      <button type="button" className="text-btn" onClick={() => setIndex((value) => value + 1)}>
        Outra oração
      </button>
    </>
  )
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4.2h4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
