import { useState } from 'react'
import { LiturgyPanel } from '@components/Liturgy'
import { RankingPanel } from '@components/Ranking'
import { SaintDayPanel } from '@components/SaintDay'
import { formatSpent } from '@domain/cycle/format-spent'
import { orderTasks } from '@domain/cycle/order-tasks'
import { canShowPeriod, periodContaining, periodForKind, periodLabel, shiftPeriod } from '@domain/cycle/period'
import { rankOfferings } from '@domain/cycle/rank-offerings'
import { summarizePeriod } from '@domain/cycle/summarize-period'
import { saints, scenes, youthScenes } from '@domain/catalogs/saints'
import type { Scene } from '@domain/models/backdrop/scene'
import type { LiturgyDay } from '@domain/models/liturgy/day'
import type { SaintDay } from '@domain/models/saint-day/day'
import type { PomodoroController } from '@main/factories/flows/usePomodoro'
import type { RankingController } from '@main/factories/flows/useRanking'

type Drawer = 'tasks' | 'settings' | 'streak' | 'liturgy' | 'saint'

type BackdropChoice = {
  saintId: string | null
  choose: (id: string | null) => void
}

export function Panels({
  panel,
  onClose,
  pomodoro,
  ranking,
  backdrop,
  liturgy,
  saint,
}: {
  panel: Drawer
  onClose: () => void
  pomodoro: PomodoroController
  ranking: RankingController
  backdrop: BackdropChoice
  liturgy: LiturgyDay | null
  saint: SaintDay | null
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
        {panel === 'tasks' ? <Tasks pomodoro={pomodoro} onClose={onClose} /> : null}
        {panel === 'settings' ? <Settings pomodoro={pomodoro} backdrop={backdrop} /> : null}
        {panel === 'streak' ? <Streak pomodoro={pomodoro} ranking={ranking} /> : null}
        {panel === 'liturgy' && liturgy ? <LiturgyPanel day={liturgy} /> : null}
        {panel === 'saint' && saint ? <SaintDayPanel saint={saint} /> : null}
      </aside>
    </div>
  )
}

function titleOf(panel: Drawer): string {
  if (panel === 'tasks') return 'O que você oferece'
  if (panel === 'settings') return 'Ajustes'
  if (panel === 'liturgy') return 'Liturgia de hoje'
  if (panel === 'saint') return 'Santo do dia'
  return 'Sequência'
}

function Tasks({ pomodoro, onClose }: { pomodoro: PomodoroController; onClose: () => void }) {
  const [draft, setDraft] = useState('')
  const [planned, setPlanned] = useState(1)
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
        className="offer-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (!pomodoro.addTask(draft, planned)) return
          setDraft('')
          setPlanned(1)
          onClose()
        }}
      >
        <Stepper label="Entradas de foco" value={planned} min={1} max={12} unit="" onChange={setPlanned} />
        <div className="add-task">
          <input
            id="offer-name"
            value={draft}
            maxLength={140}
            placeholder="Uma tarefa para este foco"
            aria-label="Nova tarefa"
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit">Adicionar</button>
        </div>
      </form>
      {tasks.length === 0 ? (
        <p className="empty">Nada ainda. Dê um nome ao que vai oferecer a Deus no próximo foco.</p>
      ) : (
        <ul className="task-list">
          {orderTasks(tasks).map((task) => (
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
                  {task.focusCount} de {task.plannedFocuses}
                  {' · '}
                  {task.focusSeconds > 0 ? formatSpent(task.focusSeconds) : 'ainda sem tempo'}
                </small>
              </button>
              <button type="button" className="remove" aria-label={`Remover ${task.title}`} onClick={() => pomodoro.removeTask(task.id)}>
                ×
              </button>
              <div className="task-plan">
                <Stepper
                  label="Entradas de foco"
                  value={task.plannedFocuses}
                  min={1}
                  max={12}
                  unit=""
                  onChange={(plannedFocuses) => pomodoro.setPlannedFocuses(task.id, plannedFocuses)}
                />
              </div>
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
  const pictured = new Set([...scenes, ...youthScenes].flatMap((scene) => (scene.saintId == null ? [] : [scene.saintId])))
  const backdropSaints = saints.filter((saint) => !pictured.has(saint.id))
  return (
    <div className="drawer-body">
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
        <div className="rhythm-row">
          <button
            type="button"
            className="text-btn"
            onClick={() => updateSettings({ offeringMin: 1, focusMin: 25, pauseMin: 5, longPauseMin: 15 })}
          >
            Restaurar 1 · 25 · 5 · 15
          </button>
          <button
            type="button"
            className="text-btn"
            aria-label="Pausa mais longa: 1, 25, 10 e 20"
            onClick={() => updateSettings({ offeringMin: 1, focusMin: 25, pauseMin: 10, longPauseMin: 20 })}
          >
            1 · 25 · 10 · 20
          </button>
        </div>
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
        <Switch label="Começar a oração sozinha" checked={settings.autoAdvance} onChange={(autoAdvance) => updateSettings({ autoAdvance })} />
        <Switch label="Sino ao terminar" checked={settings.sound} onChange={(sound) => updateSettings({ sound })} />
        <label className="bell-volume">
          <span id="bell-volume-label">Volume do sino</span>
          <strong>{settings.soundVolume}</strong>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={settings.soundVolume}
            aria-labelledby="bell-volume-label"
            onChange={(event) => updateSettings({ soundVolume: Number(event.target.value) })}
          />
        </label>
        <Switch label="Repetir o sino" checked={settings.repeatBell} onChange={(repeatBell) => updateSettings({ repeatBell })} />
        <Switch
          label="Avisar dois minutos antes"
          checked={settings.warnTwoMinutes}
          onChange={(warnTwoMinutes) => updateSettings({ warnTwoMinutes })}
        />
      </section>
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
          {backdropSaints.map((saint) => {
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

function Streak({ pomodoro, ranking }: { pomodoro: PomodoroController; ranking: RankingController }) {
  const [tab, setTab] = useState<'resumo' | 'ofertas' | 'ranking'>('resumo')
  const [period, setPeriod] = useState(() => periodContaining(new Date(), 'week'))
  const summary = summarizePeriod(pomodoro.journal, period)
  const offerings = rankOfferings(pomodoro.journal, period)
  const previous = shiftPeriod(period, -1)
  const following = shiftPeriod(period, 1)

  return (
    <div className="drawer-body">
      <div className="choice" role="tablist" aria-label="Sequência">
        <button type="button" role="tab" aria-selected={tab === 'resumo'} className={tab === 'resumo' ? 'is-on' : ''} onClick={() => setTab('resumo')}>
          Resumo
        </button>
        <button type="button" role="tab" aria-selected={tab === 'ofertas'} className={tab === 'ofertas' ? 'is-on' : ''} onClick={() => setTab('ofertas')}>
          Ofertas
        </button>
        <button type="button" role="tab" aria-selected={tab === 'ranking'} className={tab === 'ranking' ? 'is-on' : ''} onClick={() => setTab('ranking')}>
          <span aria-hidden="true">🏆 </span>Ranking
        </button>
      </div>
      {tab === 'ranking' ? <RankingPanel ranking={ranking} /> : null}
      {tab === 'ranking' ? null : (
      <>
      <div className="period-nav">
        <button
          type="button"
          aria-label="Período anterior"
          disabled={!canShowPeriod(previous)}
          onClick={() => setPeriod(previous)}
        >
          ←
        </button>
        <div className="choice">
          <button type="button" className={period.kind === 'week' ? 'is-on' : ''} onClick={() => setPeriod((current) => periodForKind(current, 'week'))}>
            Semana
          </button>
          <button type="button" className={period.kind === 'month' ? 'is-on' : ''} onClick={() => setPeriod((current) => periodForKind(current, 'month'))}>
            Mês
          </button>
        </div>
        <button
          type="button"
          aria-label="Período seguinte"
          disabled={!canShowPeriod(following)}
          onClick={() => setPeriod(following)}
        >
          →
        </button>
      </div>
      <p className="period-label">{periodLabel(period)}</p>
      {tab === 'resumo' ? (
        <div role="tabpanel">
          <ul className="hour-cards">
            <li>
              <span>Horas oferecidas</span>
              <strong>{summary.hoursLabel}</strong>
            </li>
            <li>
              <span>Dias com foco</span>
              <strong>{summary.focusDays}</strong>
            </li>
            <li>
              <span>Sequência</span>
              <strong>{pomodoro.stats.streak}</strong>
            </li>
          </ul>
          <div className={summary.scaleHours ? 'hour-chart is-empty' : 'hour-chart'}>
            {summary.scaleHours ? (
              <div className="hour-scale" aria-hidden="true">
                <span>1</span>
                <span>0</span>
              </div>
            ) : null}
            <div className="hour-scroll">
              <div className={period.kind === 'month' ? 'hour-bars is-month' : 'hour-bars'}>
                {summary.bars.map((bar) => (
                  <div key={bar.key} className="hour-col" role="img" aria-label={bar.accessibleName}>
                    <div className="hour-track">
                      <div className="hour-bar" style={{ height: `${bar.share * 100}%` }} />
                    </div>
                    <span aria-hidden="true">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {summary.empty ? <p className="empty">Nada oferecido neste período.</p> : null}
          <p>Um dia entra na sequência quando você completa ao menos um foco. Se pular um dia, a contagem recomeça.</p>
        </div>
      ) : (
        <div role="tabpanel">
          {offerings.length === 0 ? (
            <p className="empty">Nada oferecido neste período.</p>
          ) : (
            <ol className="offer-rank">
              {offerings.map((offering) => (
                <li key={offering.id ?? 'sem-nome'}>
                  <span>{offering.position}</span>
                  <span>{offering.name}</span>
                  <strong>{offering.label}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
      </>
      )}
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
          {value}
          {unit ? ` ${unit}` : ''}
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
