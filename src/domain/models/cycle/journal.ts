export type JournalOffering = {
  id: string | null
  name: string
  seconds: number
  entries: number
}

export type JournalDay = {
  date: string
  seconds: number
  offerings: JournalOffering[]
}

export const unnamedOfferingName = 'Sem nome'
