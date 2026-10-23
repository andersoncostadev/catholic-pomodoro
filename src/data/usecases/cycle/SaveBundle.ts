import type { IStorage } from '@data/protocols/cache/storage'
import { cycleStorageKey } from '@domain/constants/storage-keys'
import type { Bundle } from '@domain/models/cycle/bundle'
import type { ISaveBundle } from '@domain/usecases/cycle/save-bundle'

export class SaveBundle implements ISaveBundle {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(bundle: Bundle): void {
    this.storage.set(cycleStorageKey, JSON.stringify(bundle))
  }
}
