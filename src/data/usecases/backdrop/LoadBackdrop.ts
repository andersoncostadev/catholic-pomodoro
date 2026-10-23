import type { IStorage } from '@data/protocols/cache/storage'
import { saints } from '@domain/catalogs/saints'
import { backdropStorageKey } from '@domain/constants/storage-keys'
import type { ILoadBackdrop } from '@domain/usecases/backdrop/load-backdrop'

const DEFAULT_ID = 'ceia'

export class LoadBackdrop implements ILoadBackdrop {
  private readonly storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
  }

  handle(): string | null {
    try {
      const raw = this.storage.get(backdropStorageKey)
      if (raw == null) return DEFAULT_ID
      const parsed = JSON.parse(raw) as { saintId?: unknown }
      if (parsed.saintId == null) return null
      if (parsed.saintId === 'pieta') return 'assis'
      if (parsed.saintId === 'caminho') return 'vocacao'
      if (parsed.saintId === 'jornada') return 'votos'
      if (parsed.saintId === 'peregrinos') return 'adoracao'
      return saints.some((saint) => saint.id === parsed.saintId) ? String(parsed.saintId) : DEFAULT_ID
    } catch {
      return DEFAULT_ID
    }
  }
}
