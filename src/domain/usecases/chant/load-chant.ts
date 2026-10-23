import type { SavedChant } from '@domain/models/chant/saved-chant'

export interface ILoadChant {
  handle(): SavedChant
}
