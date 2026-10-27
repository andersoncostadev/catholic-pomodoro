import type { ISaintClient } from '@data/protocols/http/saint-client'
import type { SaintDay } from '@domain/models/saint-day/day'
import { readSaintDay } from '@domain/saint-day/read-day'
import type { ILoadSaint } from '@domain/usecases/saint-day/load-saint'

export class LoadSaint implements ILoadSaint {
  private readonly client: ISaintClient

  constructor(client: ISaintClient) {
    this.client = client
  }

  async handle(day: string): Promise<SaintDay | null> {
    const body = await this.client.load(day)
    if (body == null || body.trim() === '') return null
    try {
      return readSaintDay(JSON.parse(body))
    } catch {
      return null
    }
  }
}
