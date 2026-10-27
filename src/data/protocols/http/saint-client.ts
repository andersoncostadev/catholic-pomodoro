export interface ISaintClient {
  load(day: string): Promise<string | null>
}
