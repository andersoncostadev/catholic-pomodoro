import type { IRankingClient, RankingPublishBody } from '@data/protocols/http/ranking-client'

const TIMEOUT_MS = 8000

export class RankingHttpClient implements IRankingClient {
  async load(id: string | null): Promise<string | null> {
    const query = id ? `?id=${encodeURIComponent(id)}` : ''
    try {
      const response = await fetch(`/api/ranking${query}`, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: 'no-store',
      })
      if (response.status !== 200) return null
      const body = await response.text()
      return body.trim() === '' ? null : body
    } catch {
      return null
    }
  }

  async publish(body: RankingPublishBody): Promise<boolean> {
    return this.send('POST', body)
  }

  async leave(id: string): Promise<boolean> {
    return this.send('DELETE', { id })
  }

  private async send(method: 'POST' | 'DELETE', body: RankingPublishBody | { id: string }): Promise<boolean> {
    try {
      const response = await fetch('/api/ranking', {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: 'no-store',
      })
      return response.status === 204
    } catch {
      return false
    }
  }
}
