export type RankingRow = {
  place: number
  name: string
  seconds: number
}

export type RankingBoard = {
  weekStart: string
  rows: RankingRow[]
  me: RankingRow | null
}
