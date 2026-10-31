import { LoadRankingBoard } from '@data/usecases/ranking/LoadRankingBoard'
import type { ILoadRankingBoard } from '@domain/usecases/ranking/load-board'
import { RankingHttpClient } from '@infra/http/ranking-client'

export function makeLoadRankingBoard(): ILoadRankingBoard {
  return new LoadRankingBoard(new RankingHttpClient())
}
