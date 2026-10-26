import { LoadLiturgy } from '@data/usecases/liturgy/LoadLiturgy'
import type { ILoadLiturgy } from '@domain/usecases/liturgy/load-liturgy'
import { LiturgyHttpClient } from '@infra/http/liturgy-client'

export function makeLoadLiturgy(): ILoadLiturgy {
  return new LoadLiturgy(new LiturgyHttpClient())
}
