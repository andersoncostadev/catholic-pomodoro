import type { IStorage } from '@data/protocols/cache/storage'
import { chantStorageKey } from '@domain/constants/storage-keys'
import type { SavedChant } from '@domain/models/chant/saved-chant'
import type { ISaveChant } from '@domain/usecases/chant/save-chant'

export class SaveChant implements ISaveChant {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(chant: SavedChant): void {
    this.storage.set(chantStorageKey, JSON.stringify({ trackId: chant.trackId, volume: chant.volume }))
  }
}
