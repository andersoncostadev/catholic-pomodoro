import type { RankingIdentity } from '@domain/models/ranking/identity'

export interface ILoadRankingIdentity {
  handle(): RankingIdentity | null
}
