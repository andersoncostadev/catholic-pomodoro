import type { Accent } from '@domain/models/cycle/accent'
import type { Tone } from '@domain/models/backdrop/tone'

export type Saint = {
  id: string
  title: string
  subtitle: string
  src: string
  credit: string
  license: string
  licenseUrl: string
  sourceUrl: string
  tone: Tone
  suggestedAccent: Accent
}
