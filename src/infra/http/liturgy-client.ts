import type { ILiturgyClient } from '@data/protocols/http/liturgy-client'

const ENDPOINT = 'https://liturgia.cloudhub.ia.br/v1/liturgia'
const TIMEOUT_MS = 8000

export class LiturgyHttpClient implements ILiturgyClient {
  async load(day: string): Promise<string | null> {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day)
    if (!parts) return null
    const [, year, month, date] = parts
    const url = new URL(ENDPOINT)
    url.searchParams.set('dia', String(Number(date)))
    url.searchParams.set('mes', String(Number(month)))
    url.searchParams.set('ano', year)

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' })
      if (response.status !== 200) return null
      const body = await response.text()
      return body.trim() === '' ? null : body
    } catch {
      return null
    }
  }
}
