import type { RankingBoard } from '@domain/models/ranking/board'

export interface ILoadRankingBoard {
  handle(id: string | null): Promise<RankingBoard | null>
}
