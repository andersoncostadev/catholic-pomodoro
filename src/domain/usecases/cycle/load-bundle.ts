import type { Bundle } from '@domain/models/cycle/bundle'

export interface ILoadBundle {
  handle(): Bundle
}
