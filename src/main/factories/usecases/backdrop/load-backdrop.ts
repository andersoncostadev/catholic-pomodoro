import { LoadBackdrop } from '@data/usecases/backdrop/LoadBackdrop'
import type { ILoadBackdrop } from '@domain/usecases/backdrop/load-backdrop'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeLoadBackdrop(): ILoadBackdrop {
  return new LoadBackdrop(makeStorage())
}
