import type { IStorage } from '@data/protocols/cache/storage'
import { rankingStorageKey } from '@domain/constants/storage-keys'
import type { RankingIdentity } from '@domain/models/ranking/identity'
import { nicknameOrNull } from '@domain/ranking/nickname'
import { uuidOrNull } from '@domain/ranking/uuid'
import type { ILoadRankingIdentity } from '@domain/usecases/ranking/load-identity'

export class LoadRankingIdentity implements ILoadRankingIdentity {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(): RankingIdentity | null {
    try {
      const raw = JSON.parse(this.storage.get(rankingStorageKey) ?? '') as Partial<RankingIdentity>
      const id = uuidOrNull(raw.id)
      const name = nicknameOrNull(raw.name)
      if (!id || !name) return null
      return { id, name }
    } catch {
      return null
    }
  }
}
