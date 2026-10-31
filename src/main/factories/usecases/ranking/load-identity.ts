import { LoadRankingIdentity } from '@data/usecases/ranking/LoadRankingIdentity'
import type { ILoadRankingIdentity } from '@domain/usecases/ranking/load-identity'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeLoadRankingIdentity(): ILoadRankingIdentity {
  return new LoadRankingIdentity(makeStorage())
}
