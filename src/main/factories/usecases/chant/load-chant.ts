import { LoadChant } from '@data/usecases/chant/LoadChant'
import type { ILoadChant } from '@domain/usecases/chant/load-chant'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeLoadChant(): ILoadChant {
  return new LoadChant(makeStorage())
}
