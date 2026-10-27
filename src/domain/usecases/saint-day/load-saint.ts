import type { SaintDay } from '@domain/models/saint-day/day'

export interface ILoadSaint {
  handle(day: string): Promise<SaintDay | null>
}
