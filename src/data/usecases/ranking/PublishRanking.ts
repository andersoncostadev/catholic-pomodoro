import type { IRankingClient } from '@data/protocols/http/ranking-client'
import { focusSecondsOrNull } from '@domain/ranking/focus-seconds'
import { nicknameOrNull } from '@domain/ranking/nickname'
import { uuidOrNull } from '@domain/ranking/uuid'
import type { IPublishRanking, RankingPublication } from '@domain/usecases/ranking/publish-ranking'

export class PublishRanking implements IPublishRanking {
  private readonly client: IRankingClient

  constructor(client: IRankingClient) {
    this.client = client
  }

  async handle(publication: RankingPublication): Promise<boolean> {
    const id = uuidOrNull(publication.id)
    const name = nicknameOrNull(publication.name)
    if (!id || !name) return false
    if (publication.seconds == null || publication.seconds === 0) return this.client.publish({ id, name })
    const seconds = focusSecondsOrNull(publication.seconds)
    if (seconds == null) return false
    return this.client.publish({ id, name, seconds })
  }
}
