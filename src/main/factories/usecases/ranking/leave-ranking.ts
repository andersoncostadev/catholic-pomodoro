import { LeaveRanking } from '@data/usecases/ranking/LeaveRanking'
import type { ILeaveRanking } from '@domain/usecases/ranking/leave-ranking'
import { RankingHttpClient } from '@infra/http/ranking-client'

export function makeLeaveRanking(): ILeaveRanking {
  return new LeaveRanking(new RankingHttpClient())
}