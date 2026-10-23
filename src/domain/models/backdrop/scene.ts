import type { Accent } from '@domain/models/cycle/accent'
import type { ThemeName } from '@domain/models/cycle/theme-name'

export type Scene = {
  id: string
  name: string
  saintId: string | null
  theme: ThemeName
  accent: Accent
}
