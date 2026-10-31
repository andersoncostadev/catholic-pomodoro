import type { IStorage } from '@data/protocols/cache/storage'
import { rankingStorageKey } from '@domain/constants/storage-keys'
import type { RankingIdentity } from '@domain/models/ranking/identity'
import { nicknameOrNull } from '@domain/ranking/nickname'
import { uuidOrNull } from '@domain/ranking/uuid'
import type { ISaveRankingIdentity } from '@domain/usecases/ranking/save-identity'

export class SaveRankingIdentity implements ISaveRankingIdentity {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(identity: RankingIdentity): void {
    const id = uuidOrNull(identity.id)
    const name = nicknameOrNull(identity.name)
    if (!id || !name) return
    this.storage.set(rankingStorageKey, JSON.stringify({ id, name }))
  }
}
