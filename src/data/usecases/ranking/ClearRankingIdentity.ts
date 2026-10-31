import type { IStorage } from '@data/protocols/cache/storage'
import { rankingStorageKey } from '@domain/constants/storage-keys'
import type { IClearRankingIdentity } from '@domain/usecases/ranking/clear-identity'

export class ClearRankingIdentity implements IClearRankingIdentity {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(): boolean {
    return this.storage.remove(rankingStorageKey)
  }
}
