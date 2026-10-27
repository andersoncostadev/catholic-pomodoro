import type { ISaintClient } from '@data/protocols/http/saint-client'

const TIMEOUT_MS = 8000

export class SaintHttpClient implements ISaintClient {
  private readonly endpoint: string

  constructor(endpoint: string | undefined) {
    this.endpoint = endpoint?.trim().replace(/\/+$/, '') ?? ''
  }

  async load(day: string): Promise<string | null> {
    if (!this.endpoint || !/^\d{2}-\d{2}$/.test(day)) return null

    try {
      const response = await fetch(`${this.endpoint}/santo-do-dia/${day}`, {
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
}
