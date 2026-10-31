export type RankingPublishBody = {
  id: string
  name: string
  seconds?: number
}

export interface IRankingClient {
  load(id: string | null): Promise<string | null>
  publish(body: RankingPublishBody): Promise<boolean>
  leave(id: string): Promise<boolean>
}
