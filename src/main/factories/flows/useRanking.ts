import { useCallback, useRef, useState } from 'react'
import type { RankingBoard } from '@domain/models/ranking/board'
import type { RankingIdentity } from '@domain/models/ranking/identity'
import { nicknameOrNull } from '@domain/ranking/nickname'
import { makeClearRankingIdentity } from '@main/factories/usecases/ranking/clear-identity'
import { makeLeaveRanking } from '@main/factories/usecases/ranking/leave-ranking'
import { makeLoadRankingBoard } from '@main/factories/usecases/ranking/load-board'
import { makeLoadRankingIdentity } from '@main/factories/usecases/ranking/load-identity'
import { makePublishRanking } from '@main/factories/usecases/ranking/publish-ranking'
import { makeSaveRankingIdentity } from '@main/factories/usecases/ranking/save-identity'

const loadIdentity = makeLoadRankingIdentity()
const saveIdentity = makeSaveRankingIdentity()
const clearIdentity = makeClearRankingIdentity()
const loadBoard = makeLoadRankingBoard()
const publishRanking = makePublishRanking()
const leaveRanking = makeLeaveRanking()

export function useRanking() {
  const [identity, setIdentity] = useState<RankingIdentity | null>(() => loadIdentity.handle())
  const [board, setBoard] = useState<RankingBoard | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'absent'>('ready')
  const [leaveFailed, setLeaveFailed] = useState(false)
  const [confirmingLeave, setConfirmingLeave] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const request = useRef(0)

  const load = useCallback(async () => {
    const current = loadIdentity.handle()
    if (!current) {
      setBoard(null)
      setStatus('ready')
      return
    }
    const token = ++request.current
    setStatus('loading')
    const next = await loadBoard.handle(current.id)
    if (token !== request.current) return
    if (!next) {
      setBoard(null)
      setStatus('absent')
      return
    }
    setBoard(next)
    setStatus('ready')
  }, [])

  function join(rawName: string): boolean {
    const name = nicknameOrNull(rawName)
    if (!name) return false
    const next = { id: crypto.randomUUID(), name }
    saveIdentity.handle(next)
    setIdentity(loadIdentity.handle())
    setLeaveFailed(false)
    return true
  }

  function rename(rawName: string): boolean {
    const current = loadIdentity.handle()
    if (!current) return false
    const name = nicknameOrNull(rawName)
    if (!name) return false
    const next = { id: current.id, name }
    saveIdentity.handle(next)
    setIdentity(loadIdentity.handle())
    void publishRanking.handle({ id: next.id, name, seconds: null }).finally(() => {
      void load()
    })
    return true
  }

  function askLeave() {
    setConfirmingLeave(true)
    setLeaveFailed(false)
  }

  function stay() {
    setConfirmingLeave(false)
  }

  async function confirmLeave() {
    const current = loadIdentity.handle()
    if (!current || leaving) return
    setLeaving(true)
    const gone = await leaveRanking.handle(current.id)
    if (!gone || !clearIdentity.handle()) {
      setLeaveFailed(true)
      setConfirmingLeave(false)
      setLeaving(false)
      return
    }
    setIdentity(null)
    setBoard(null)
    setStatus('ready')
    setLeaveFailed(false)
    setConfirmingLeave(false)
    setLeaving(false)
  }

  return {
    identity,
    board,
    status,
    leaveFailed,
    confirmingLeave,
    leaving,
    load,
    join,
    rename,
    askLeave,
    stay,
    confirmLeave,
  }
}

export type RankingController = ReturnType<typeof useRanking>
