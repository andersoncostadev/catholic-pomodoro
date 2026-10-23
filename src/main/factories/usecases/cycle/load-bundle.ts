import { LoadBundle } from '@data/usecases/cycle/LoadBundle'
import type { ILoadBundle } from '@domain/usecases/cycle/load-bundle'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeLoadBundle(): ILoadBundle {
  return new LoadBundle(makeStorage())
}
