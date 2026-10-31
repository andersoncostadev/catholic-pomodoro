import { SaveRankingIdentity } from '@data/usecases/ranking/SaveRankingIdentity'
import type { ISaveRankingIdentity } from '@domain/usecases/ranking/save-identity'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeSaveRankingIdentity(): ISaveRankingIdentity {
  return new SaveRankingIdentity(makeStorage())
}
