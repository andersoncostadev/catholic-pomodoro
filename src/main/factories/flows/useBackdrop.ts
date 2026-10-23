import { useEffect, useState } from 'react'
import { saints } from '@domain/catalogs/saints'
import { makeLoadBackdrop } from '@main/factories/usecases/backdrop/load-backdrop'
import { makeSaveBackdrop } from '@main/factories/usecases/backdrop/save-backdrop'

const loadBackdrop = makeLoadBackdrop()
const saveBackdrop = makeSaveBackdrop()

export function useBackdrop() {
  const [saintId, setSaintId] = useState<string | null>(() => loadBackdrop.handle())

  useEffect(() => {
    saveBackdrop.handle(saintId)
  }, [saintId])

  return {
    saintId,
    saint: saints.find((saint) => saint.id === saintId) ?? null,
    choose: setSaintId,
  }
}
