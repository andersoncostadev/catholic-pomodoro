export type RankingPublication = {
  id: string
  name: string
  seconds: number | null
}

export interface IPublishRanking {
  handle(publication: RankingPublication): Promise<boolean>
}
