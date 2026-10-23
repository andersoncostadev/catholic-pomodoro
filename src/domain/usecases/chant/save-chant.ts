import type { SavedChant } from '@domain/models/chant/saved-chant'

export interface ISaveChant {
  handle(chant: SavedChant): void
}
