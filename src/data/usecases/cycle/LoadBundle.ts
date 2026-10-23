import type { IStorage } from '@data/protocols/cache/storage'
import { sanitizeBundle } from '@domain/cycle/sanitize-bundle'
import { cycleStorageKey } from '@domain/constants/storage-keys'
import type { ILoadBundle } from '@domain/usecases/cycle/load-bundle'
import type { Bundle } from '@domain/models/cycle/bundle'

export class LoadBundle implements ILoadBundle {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(): Bundle {
    try {
      const text = this.storage.get(cycleStorageKey)
      if (!text) return sanitizeBundle({})
      return sanitizeBundle(JSON.parse(text) as unknown)
    } catch {
      return sanitizeBundle({})
    }
  }
}
