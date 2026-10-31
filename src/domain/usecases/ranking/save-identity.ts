import type { RankingIdentity } from '@domain/models/ranking/identity'

export interface ISaveRankingIdentity {
  handle(identity: RankingIdentity): void
}
