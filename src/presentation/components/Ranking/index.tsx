import { useEffect, useState } from 'react'
import { formatRankingTime } from '@domain/ranking/format-time'
import type { RankingRow } from '@domain/models/ranking/board'
import type { RankingController } from '@main/factories/flows/useRanking'

export function RankingNamePrompt({ onJoin, onLater }: { onJoin: (name: string) => boolean; onLater: () => void }) {
  const [draft, setDraft] = useState('')
  const [refused, setRefused] = useState(false)

  useEffect(() => {
    document.getElementById('ranking-name')?.focus()
  }, [])

  return (
    <div className="rank-gate">
      <form
        className="leave rank-gate-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ranking-name-title"
        onSubmit={(event) => {
          event.preventDefault()
          setRefused(!onJoin(draft))
        }}
      >
        <p className="rank-spark" aria-hidden="true">✨ 🏆 🔥</p>
        <h2 id="ranking-name-title">Seu nome no ranking</h2>
        <p>Esse é o nome que entra no ranking da semana.</p>
        <label className="field" htmlFor="ranking-name">
          <span>Como você quer aparecer</span>
          <input
            id="ranking-name"
            value={draft}
            maxLength={40}
            autoComplete="off"
            aria-invalid={refused}
            onChange={(event) => {
              setDraft(event.target.value)
              setRefused(false)
            }}
          />
        </label>
        {refused ? <p className="empty">Use de 2 a 24 letras, números, espaço, hífen ou apóstrofo.</p> : null}
        <div className="leave-actions">
          <button type="submit" className="primary">
            Entrar no ranking ✨
          </button>
          <button type="button" className="leave-go" onClick={onLater}>
            Agora não
          </button>
        </div>
      </form>
    </div>
  )
}

export function RankingPanel({ ranking }: { ranking: RankingController }) {
  const { identity } = ranking
  const [draft, setDraft] = useState(identity?.name ?? '')
  const [refused, setRefused] = useState(false)

  useEffect(() => {
    setDraft(identity?.name ?? '')
    setRefused(false)
  }, [identity?.id, identity?.name])

  useEffect(() => {
    void ranking.load()
  }, [ranking.load, identity?.id])

  return (
    <div className="rank-panel">
      {identity ? <Board ranking={ranking} /> : null}
      {ranking.confirmingLeave ? (
        <div className="leave" role="group" aria-label="Sair do ranking? Sua linha some para as outras pessoas.">
          <p>Sair do ranking? Sua linha some para as outras pessoas.</p>
          <div className="leave-actions">
            <button type="button" className="primary" onClick={ranking.stay} disabled={ranking.leaving}>
              Ficar
            </button>
            <button type="button" className="leave-go" onClick={() => void ranking.confirmLeave()} disabled={ranking.leaving}>
              Sair
            </button>
          </div>
        </div>
      ) : null}
      <form
        className="add-task rank-form"
        onSubmit={(event) => {
          event.preventDefault()
          const ok = identity ? ranking.rename(draft) : ranking.join(draft)
          setRefused(!ok)
        }}
      >
        <label className="field">
          <span>Como você quer aparecer</span>
          <input
            value={draft}
            maxLength={40}
            autoComplete="off"
            aria-invalid={refused}
            onChange={(event) => {
              setDraft(event.target.value)
              setRefused(false)
            }}
          />
        </label>
        <button type="submit">{identity ? 'Trocar apelido ✏️' : 'Entrar no ranking ✨'}</button>
      </form>
      {refused ? <p className="empty">Use de 2 a 24 letras, números, espaço, hífen ou apóstrofo.</p> : null}
      {identity && !ranking.confirmingLeave ? (
        <button type="button" className="text-btn" onClick={ranking.askLeave}>
          Sair do ranking 👋
        </button>
      ) : null}
      {ranking.leaveFailed ? <p className="empty">Não foi possível sair.</p> : null}
    </div>
  )
}

function Board({ ranking }: { ranking: RankingController }) {
  if (ranking.status === 'absent') {
    return <p className="empty"><span aria-hidden="true">🙏 </span>O ranking não carregou. O que você ofereceu continua neste navegador.</p>
  }
  if (ranking.status !== 'ready' || ranking.board == null) return <p className="empty"><span aria-hidden="true">✨ </span>Carregando o ranking…</p>

  const board = ranking.board
  const mine = board.me
  const listed = mine != null && board.rows.some((row) => sameLine(row, mine))
  return (
    <>
      {board.rows.length === 0 && mine == null ? <p className="empty"><span aria-hidden="true">🌱 </span>Ninguém entrou nesta semana.</p> : null}
      {board.rows.length > 0 ? (
        <ol className="offer-rank rank-list">
          {board.rows.map((row) => (
            <RankLine key={`${row.place}-${row.name}`} row={row} you={mine != null && sameLine(row, mine)} />
          ))}
        </ol>
      ) : null}
      {mine != null && !listed ? (
        <ol className="offer-rank rank-list">
          <RankLine row={mine} you />
        </ol>
      ) : null}
      {mine == null ? <p className="empty"><span aria-hidden="true">🔥 </span>Você ainda não concluiu um foco nesta semana.</p> : null}
    </>
  )
}

function RankLine({ row, you }: { row: RankingRow; you: boolean }) {
  return (
    <li className={you ? 'is-you' : undefined}>
      <span className="rank-place" aria-label={`${row.place}º lugar`}>
        <span aria-hidden="true">{placeMark(row.place)}</span>
      </span>
      <span>
        {row.name}
        {you ? <span className="rank-you">você ✨</span> : null}
      </span>
      <strong>{formatRankingTime(row.seconds)}</strong>
    </li>
  )
}

function placeMark(place: number): string {
  if (place === 1) return '🥇'
  if (place === 2) return '🥈'
  if (place === 3) return '🥉'
  return `${place}`
}

function sameLine(row: RankingRow, me: RankingRow): boolean {
  return row.name === me.name && row.seconds === me.seconds
}
