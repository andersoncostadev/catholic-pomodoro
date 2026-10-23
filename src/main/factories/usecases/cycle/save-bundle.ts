import { SaveBundle } from '@data/usecases/cycle/SaveBundle'
import type { ISaveBundle } from '@domain/usecases/cycle/save-bundle'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeSaveBundle(): ISaveBundle {
  return new SaveBundle(makeStorage())
}
