import { useState } from 'react'
import { formatSpent } from '@domain/cycle/format-spent'
import { saints, scenes, youthScenes } from '@domain/catalogs/saints'
import type { Scene } from '@domain/models/backdrop/scene'
import type { PomodoroController } from '@main/factories/flows/usePomodoro'

type BackdropChoice = {
  saintId: string | null
  choose: (id: string | null) => void
}

export function Panels({
  panel,
  onClose,
  pomodoro,
  backdrop,
}: {
  panel: 'tasks' | 'settings' | 'streak'
  onClose: () => void
  pomodoro: PomodoroController
  backdrop: BackdropChoice
}) {
  return (
    <div className="drawer-root">
      <button type="button" className="backdrop" aria-label="Fechar painel" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={titleOf(panel)}>
        <header>
          <h2>{titleOf(panel)}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>
        {panel === 'tasks' ? <Tasks pomodoro={pomodoro} /> : null}
        {panel === 'settings' ? <Settings pomodoro={pomodoro} backdrop={backdrop} /> : null}
        {panel === 'streak' ? <Streak pomodoro={pomodoro} /> : null}
      </aside>
    </div>
  )
}

function titleOf(panel: 'tasks' | 'settings' | 'streak'): string {
  if (panel === 'tasks') return 'O que você oferece'
  if (panel === 'settings') return 'Temas'
  return 'Sequência'
}

function Tasks({ pomodoro }: { pomodoro: PomodoroController }) {
  const [draft, setDraft] = useState('')
  const { tasks, selectedTaskId } = pomodoro

  return (
    <div className="drawer-body">
      <label className="field">
        <span>Intenção de hoje</span>
        <input
          value={pomodoro.intention}
          maxLength={180}
          placeholder="Hoje ofereço a Deus…"
          onChange={(event) => pomodoro.setIntention(event.target.value)}
        />
      </label>
      <form
        className="add-task"
        onSubmit={(event) => {
          event.preventDefault()
          pomodoro.addTask(draft)
          setDraft('')
        }}
      >
        <input
          value={draft}
          maxLength={140}
          placeholder="Uma tarefa para este foco"
          aria-label="Nova tarefa"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>
      {tasks.length === 0 ? (
        <p className="empty">Nada ainda. Dê um nome ao que vai oferecer a Deus no próximo foco.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? 'is-done' : ''}>
              <button
                type="button"
                className="check"
                aria-pressed={task.done}
                aria-label={task.done ? 'Marcar como não feita' : 'Marcar como feita'}
                onClick={() => pomodoro.toggleTask(task.id)}
              />
              <button
                type="button"
                className={selectedTaskId === task.id ? 'task-main is-selected' : 'task-main'}
                onClick={() => pomodoro.setSelectedTaskId(task.done ? selectedTaskId : task.id)}
              >
                <strong>{task.title}</strong>
                <small>
                  {selectedTaskId === task.id ? 'Este foco · ' : ''}
                  {task.focusSeconds > 0 ? formatSpent(task.focusSeconds) : 'ainda sem tempo'}
                </small>
              </button>
              <button type="button" className="remove" aria-label={`Remover ${task.title}`} onClick={() => pomodoro.removeTask(task.id)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {tasks.some((task) => task.done) ? (
        <button type="button" className="text-btn" onClick={pomodoro.clearDone}>
          Limpar concluídas
        </button>
      ) : null}
    </div>
  )
}

function Settings({ pomodoro, backdrop }: { pomodoro: PomodoroController; backdrop: BackdropChoice }) {
  const { settings, updateSettings } = pomodoro
  return (
    <div className="drawer-body">
      <section>
        <h3>Cenas</h3>
        <div className="saint-grid" role="listbox" aria-label="Cenas">
          {scenes.map((scene) => {
            const active = scene.saintId === backdrop.saintId && scene.theme === settings.theme && scene.accent === settings.accent
            return (
              <button
                key={scene.id}
                type="button"
                className={active ? 'saint is-on' : 'saint'}
                role="option"
                aria-selected={active}
                onClick={() => {
                  backdrop.choose(scene.saintId)
                  updateSettings({ theme: scene.theme, accent: scene.accent })
                }}
              >
                <SceneThumb scene={scene} />
                <small>{scene.name}</small>
              </button>
            )
          })}
        </div>
      </section>
      <section>
        <h3>Juventude</h3>
        <div className="saint-grid" role="listbox" aria-label="Juventude">
          {youthScenes.map((scene) => {
            const active = scene.saintId === backdrop.saintId && scene.theme === settings.theme && scene.accent === settings.accent
            return (
              <button
                key={scene.id}
                type="button"
                className={active ? 'saint is-on' : 'saint'}
                role="option"
                aria-selected={active}
                onClick={() => {
                  backdrop.choose(scene.saintId)
                  updateSettings({ theme: scene.theme, accent: scene.accent })
                }}
              >
                <SceneThumb scene={scene} />
                <small>{scene.name}</small>
              </button>
            )
          })}
        </div>
      </section>
      <section>
        <h3>Fundo e cor</h3>
        <div className="saint-grid" role="listbox" aria-label="Imagens de fundo">
          <button
            type="button"
            className={backdrop.saintId == null ? 'saint is-on' : 'saint'}
            role="option"
            aria-selected={backdrop.saintId == null}
            onClick={() => backdrop.choose(null)}
          >
            <span className="saint-plain" aria-hidden="true" />
            <small>Nenhum</small>
          </button>
          {saints.map((saint) => {
            const active = backdrop.saintId === saint.id
            return (
              <button
                key={saint.id}
                type="button"
                className={active ? 'saint is-on' : 'saint'}
                role="option"
                aria-selected={active}
                onClick={() => {
                  backdrop.choose(saint.id)
                  updateSettings({ accent: saint.suggestedAccent })
                }}
              >
                <img src={saint.src} alt="" />
                <small>{saint.title}</small>
              </button>
            )
          })}
        </div>
        <details className="music-credit">
          <summary>Fontes das imagens</summary>
          <ul>
            {saints.map((saint) => (
              <li key={saint.id}>
                {saint.title}, {saint.subtitle}: {saint.credit}.{' '}
                <a href={saint.licenseUrl} target="_blank" rel="noreferrer">
                  {saint.license}
                </a>
                {' · '}
                <a href={saint.sourceUrl} target="_blank" rel="noreferrer">
                  fonte
                </a>
              </li>
            ))}
          </ul>
        </details>
        <p className="field-label">Ambiente</p>
        <div className="choice">
          {(
            [
              ['capela', 'Capela'],
              ['alvorada', 'Alvorada'],
              ['noite', 'Noite'],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className={settings.theme === id ? 'is-on' : ''} onClick={() => updateSettings({ theme: id })}>
              {label}
            </button>
          ))}
        </div>
        <p className="field-label">Cor</p>
        <div className="swatches">
          {(
            [
              ['gold', 'Dourado'],
              ['rose', 'Rosa'],
              ['blue', 'Azul'],
              ['coral', 'Coral'],
              ['menta', 'Menta'],
              ['lima', 'Lima'],
              ['brisa', 'Brisa'],
              ['manto', 'Manto'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={settings.accent === id ? `swatch is-on swatch-${id}` : `swatch swatch-${id}`}
              aria-label={label}
              aria-pressed={settings.accent === id}
              onClick={() => updateSettings({ accent: id })}
            />
          ))}
        </div>
      </section>
      <section>
        <h3>Tempos</h3>
        <Stepper label="Oração" value={settings.offeringMin} min={1} max={15} unit="min" onChange={(offeringMin) => updateSettings({ offeringMin })} />
        <Stepper label="Foco" value={settings.focusMin} min={5} max={90} unit="min" onChange={(focusMin) => updateSettings({ focusMin })} />
        <Stepper label="Pausa" value={settings.pauseMin} min={1} max={30} unit="min" onChange={(pauseMin) => updateSettings({ pauseMin })} />
        <Stepper
          label="Pausa longa"
          value={settings.longPauseMin}
          min={5}
          max={45}
          unit="min"
          onChange={(longPauseMin) => updateSettings({ longPauseMin })}
        />
        <button
          type="button"
          className="text-btn"
          onClick={() => updateSettings({ offeringMin: 1, focusMin: 25, pauseMin: 5, longPauseMin: 15 })}
        >
          Restaurar 1 · 25 · 5
        </button>
      </section>
      <section>
        <h3>Tipo de pausa</h3>
        <div className="choice">
          {(
            [
              ['decade', 'Dezena'],
              ['brief', 'Oração breve'],
              ['presence', 'Presença'],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className={settings.pauseKind === id ? 'is-on' : ''} onClick={() => updateSettings({ pauseKind: id })}>
              {label}
            </button>
          ))}
        </div>
        <Switch
          label="Pausa longa a cada 4 focos"
          checked={settings.longPauseEnabled}
          onChange={(longPauseEnabled) => updateSettings({ longPauseEnabled })}
        />
        <Switch label="Passar sozinho para a fase seguinte" checked={settings.autoAdvance} onChange={(autoAdvance) => updateSettings({ autoAdvance })} />
        <Switch label="Sino ao terminar" checked={settings.sound} onChange={(sound) => updateSettings({ sound })} />
      </section>
      <p className="footnote">Tudo fica neste navegador. Sem conta.</p>
    </div>
  )
}

function SceneThumb({ scene }: { scene: Scene }) {
  if (scene.saintId == null) return <span className="saint-plain scene-dawn" aria-hidden="true" />
  const saint = saints.find((item) => item.id === scene.saintId)
  if (!saint) return <span className="saint-plain" aria-hidden="true" />
  return <img src={saint.src} alt="" />
}

function Streak({ pomodoro }: { pomodoro: PomodoroController }) {
  const { stats } = pomodoro
  const days = stats.streak
  return (
    <div className="drawer-body">
      <p className="streak-count">
        <strong>{days}</strong>
        <span>{days === 1 ? 'dia seguido' : 'dias seguidos'}</span>
      </p>
      <p>Um dia entra na sequência quando você completa ao menos um foco. Se pular um dia, a contagem recomeça.</p>
      <ul className="today-list">
        <li>
          <span>Orações oferecidas</span>
          <strong>{stats.offeringsToday}</strong>
        </li>
        <li>
          <span>Focos</span>
          <strong>{stats.focusToday}</strong>
        </li>
        <li>
          <span>Pausas</span>
          <strong>{stats.pausesToday}</strong>
        </li>
      </ul>
    </div>
  )
}

function Stepper({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (value: number) => void
}) {
  return (
    <div className="stepper">
      <span>{label}</span>
      <div>
        <button type="button" aria-label={`Diminuir ${label}`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
          −
        </button>
        <strong>
          {value} {unit}
        </strong>
        <button type="button" aria-label={`Aumentar ${label}`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
  )
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="switch">
      <span>{label}</span>
      <span className={checked ? 'toggle is-on' : 'toggle'}>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      </span>
    </label>
  )
}
