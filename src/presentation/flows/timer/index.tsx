import { useEffect, useState } from 'react'
import { MusicMenu } from '@components/MusicMenu'
import { Panels } from '@components/Panels'
import { Story } from '@components/Story'
import { TimerHero } from '@components/TimerHero'
import type { PauseKind } from '@domain/models/cycle/pause-kind'
import type { Phase } from '@domain/models/cycle/phase'
import { useBackdrop } from '@main/factories/flows/useBackdrop'
import { usePomodoro } from '@main/factories/flows/usePomodoro'

type Panel = 'tasks' | 'settings' | 'streak' | null

export function TimerFlow() {
  const pomodoro = usePomodoro()
  const backdrop = useBackdrop()
  const [panel, setPanel] = useState<Panel>(null)
  const days = pomodoro.stats.streak

  useEffect(() => {
    document.body.style.overflow = panel ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [panel])

  useEffect(() => {
    if (!panel) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panel])

  function begin() {
    document.getElementById('timer')?.scrollIntoView({ behavior: 'smooth' })
    pomodoro.beginOffering()
  }

  return (
    <div
      className="app"
      data-theme={pomodoro.settings.theme}
      data-accent={pomodoro.settings.accent}
      data-tone={backdrop.saint?.tone}
      data-phase={markedPhase(pomodoro.session.phase, pomodoro.settings.pauseKind)}
    >
      <div className="stage">
        <div className={backdrop.saint ? 'sky has-art' : 'sky'} aria-hidden="true">
          {backdrop.saint ? (
            <>
              <img className="art-plate" src={backdrop.saint.src} alt="" />
              <span className="art-shade" />
              <span className="art-close" />
            </>
          ) : (
            <>
              <span className="orb orb-a" />
              <span className="orb orb-b" />
              <span className="orb orb-c" />
            </>
          )}
        </div>
        <div className="page">
          <header className="topbar">
            <a className="brand" href="#timer">
              <span className="mark" aria-hidden="true" />
              <span className="brand-name">Pomodoro Católico</span>
            </a>
            <div className="top-actions">
              <button type="button" className="days" onClick={() => setPanel(panel === 'streak' ? null : 'streak')}>
                <span className="days-bead" aria-hidden="true" />
                {days} {days === 1 ? 'dia' : 'dias'}
              </button>
              <MusicMenu dismiss={panel !== null} onOpen={() => setPanel(null)} />
              <button
                type="button"
                className="icon-btn"
                aria-label={pomodoro.selectedTaskId ? 'Tarefas, oferta escolhida' : 'Tarefas'}
                aria-pressed={panel === 'tasks'}
                onClick={() => setPanel(panel === 'tasks' ? null : 'tasks')}
              >
                <ListIcon />
                {pomodoro.selectedTaskId ? <span className="offer-dot" aria-hidden="true" /> : null}
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="Temas"
                aria-pressed={panel === 'settings'}
                onClick={() => setPanel(panel === 'settings' ? null : 'settings')}
              >
                <GearIcon />
              </button>
            </div>
          </header>
          <main>
            <TimerHero pomodoro={pomodoro} onOpenTasks={() => setPanel('tasks')} />
          </main>
        </div>
        {backdrop.saint ? (
          <p className="art-credit">
            {backdrop.saint.title}, {backdrop.saint.credit}.{' '}
            <a href={backdrop.saint.licenseUrl} target="_blank" rel="noreferrer">
              {backdrop.saint.license}
            </a>
            {' · '}
            <a href={backdrop.saint.sourceUrl} target="_blank" rel="noreferrer">
              fonte
            </a>
          </p>
        ) : null}
      </div>
      <Story onBegin={begin} />
      {panel ? <Panels panel={panel} onClose={() => setPanel(null)} pomodoro={pomodoro} backdrop={backdrop} /> : null}
    </div>
  )
}

function markedPhase(phase: Phase, kind: PauseKind): 'offering' | 'focus' | 'decade' | 'brief' | 'presence' | 'longPause' {
  if (phase === 'offering' || phase === 'focus') return phase
  if (kind === 'presence') return 'presence'
  if (phase === 'longPause') return 'longPause'
  return kind === 'brief' ? 'brief' : 'decade'
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7h11M8 12h11M8 17h11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4.5 7h.01M4.5 12h.01M4.5 17h.01" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
