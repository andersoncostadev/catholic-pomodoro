import type { ILiturgyClient } from '@data/protocols/http/liturgy-client'
import { readLiturgyDay } from '@domain/liturgy/read-day'
import type { LiturgyDay } from '@domain/models/liturgy/day'
import type { ILoadLiturgy } from '@domain/usecases/liturgy/load-liturgy'

export class LoadLiturgy implements ILoadLiturgy {
  private readonly client: ILiturgyClient

  constructor(client: ILiturgyClient) {
    this.client = client
  }

  async handle(day: string): Promise<LiturgyDay | null> {
    const body = await this.client.load(day)
    if (body == null || body.trim() === '') return null
    try {
      return readLiturgyDay(JSON.parse(body))
    } catch {
      return null
    }
  }
}
