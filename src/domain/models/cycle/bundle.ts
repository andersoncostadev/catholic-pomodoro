import type { JournalDay } from '@domain/models/cycle/journal'
import type { Session } from '@domain/models/cycle/session'
import type { Settings } from '@domain/models/cycle/settings'
import type { Stats } from '@domain/models/cycle/stats'
import type { Task } from '@domain/models/cycle/task'

export type Bundle = {
  settings: Settings
  tasks: Task[]
  selectedTaskId: string | null
  stats: Stats
  session: Session
  intention: string
  quoteIndex: number
  journal: JournalDay[]
}
