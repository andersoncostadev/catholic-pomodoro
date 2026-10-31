import { ClearRankingIdentity } from '@data/usecases/ranking/ClearRankingIdentity'
import type { IClearRankingIdentity } from '@domain/usecases/ranking/clear-identity'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeClearRankingIdentity(): IClearRankingIdentity {
  return new ClearRankingIdentity(makeStorage())
}
