import type { IStorage } from '@data/protocols/cache/storage'
import { LocalStorageAdapter } from '@infra/cache/local-storage-adapter'

export function makeStorage(): IStorage {
  return new LocalStorageAdapter()
}
