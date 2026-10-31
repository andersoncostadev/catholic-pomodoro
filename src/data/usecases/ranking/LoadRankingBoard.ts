import type { IRankingClient } from '@data/protocols/http/ranking-client'
import { readRankingBoard } from '@domain/ranking/read-board'
import type { RankingBoard } from '@domain/models/ranking/board'
import type { ILoadRankingBoard } from '@domain/usecases/ranking/load-board'

export class LoadRankingBoard implements ILoadRankingBoard {
  private readonly client: IRankingClient

  constructor(client: IRankingClient) {
    this.client = client
  }

  async handle(id: string | null): Promise<RankingBoard | null> {
    const body = await this.client.load(id)
    if (body == null || body.trim() === '') return null
    try {
      return readRankingBoard(JSON.parse(body))
    } catch {
      return null
    }
  }
}
