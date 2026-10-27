import { LoadSaint } from '@data/usecases/saint-day/LoadSaint'
import type { ILoadSaint } from '@domain/usecases/saint-day/load-saint'
import { SaintHttpClient } from '@infra/http/saint-client'

export function makeLoadSaint(): ILoadSaint {
  return new LoadSaint(new SaintHttpClient(import.meta.env.VITE_SAINT_API_URL))
}
