import type { Bundle } from '@domain/models/cycle/bundle'

export interface ISaveBundle {
  handle(bundle: Bundle): void
}
