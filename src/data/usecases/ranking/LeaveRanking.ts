import type { IRankingClient } from '@data/protocols/http/ranking-client'
import { uuidOrNull } from '@domain/ranking/uuid'
import type { ILeaveRanking } from '@domain/usecases/ranking/leave-ranking'

export class LeaveRanking implements ILeaveRanking {
  private readonly client: IRankingClient

  constructor(client: IRankingClient) {
    this.client = client
  }

  async handle(id: string): Promise<boolean> {
    const valid = uuidOrNull(id)
    if (!valid) return false
    return this.client.leave(valid)
  }
}
