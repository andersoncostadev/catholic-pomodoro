import type { IStorage } from '@data/protocols/cache/storage'
import { chants } from '@domain/catalogs/chants'
import { chantStorageKey } from '@domain/constants/storage-keys'
import type { SavedChant } from '@domain/models/chant/saved-chant'
import type { ILoadChant } from '@domain/usecases/chant/load-chant'

export class LoadChant implements ILoadChant {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(): SavedChant {
    try {
      const raw = JSON.parse(this.storage.get(chantStorageKey) ?? '') as Partial<SavedChant>
      const trackId = chants.some((chant) => chant.id === raw.trackId) ? (raw.trackId ?? null) : null
      const volume = typeof raw.volume === 'number' && raw.volume >= 0 && raw.volume <= 1 ? raw.volume : 0.6
      return { trackId, volume }
    } catch {
      return { trackId: null, volume: 0.6 }
    }
  }
}
