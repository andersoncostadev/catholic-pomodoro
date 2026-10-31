export interface ILeaveRanking {
  handle(id: string): Promise<boolean>
}
