import type { LiturgyDay } from '@domain/models/liturgy/day'

export interface ILoadLiturgy {
  handle(day: string): Promise<LiturgyDay | null>
}
