import type { IStorage } from '@data/protocols/cache/storage'
import { backdropStorageKey } from '@domain/constants/storage-keys'
import type { ISaveBackdrop } from '@domain/usecases/backdrop/save-backdrop'

export class SaveBackdrop implements ISaveBackdrop {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(saintId: string | null): void {
    this.storage.set(backdropStorageKey, JSON.stringify({ saintId }))
  }
}
