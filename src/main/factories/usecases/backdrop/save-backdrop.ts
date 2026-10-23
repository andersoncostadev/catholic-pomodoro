import { SaveBackdrop } from '@data/usecases/backdrop/SaveBackdrop'
import type { ISaveBackdrop } from '@domain/usecases/backdrop/save-backdrop'
import { makeStorage } from '@main/factories/cache/storage-factory'

export function makeSaveBackdrop(): ISaveBackdrop {
  return new SaveBackdrop(makeStorage())
}
