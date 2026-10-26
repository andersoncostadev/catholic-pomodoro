export interface ILiturgyClient {
  load(day: string): Promise<string | null>
}
