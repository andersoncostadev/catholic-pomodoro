import { PublishRanking } from '@data/usecases/ranking/PublishRanking'
import type { IPublishRanking } from '@domain/usecases/ranking/publish-ranking'
import { RankingHttpClient } from '@infra/http/ranking-client'

export function makePublishRanking(): IPublishRanking {
  return new PublishRanking(new RankingHttpClient())
}
