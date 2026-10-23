import { SaveChant } from '@data/usecases/chant/SaveChant'
import type { ISaveChant } from '@domain/usecases/chant/save-chant'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeSaveChant(): ISaveChant {
  return new SaveChant(makeStorage())
}
