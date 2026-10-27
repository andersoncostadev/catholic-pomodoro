export type SaintDaySource = {
  name: string
  url: string | null
  license: string
  licenseUrl: string | null
}

export type SaintDayImageCredit = {
  author: string
  license: string
  url: string | null
}

export type SaintDayCalendar = {
  name: string
  url: string | null
}

export type SaintDayLife = {
  birth: string | null
  death: string | null
}

export type SaintDayVeneration = {
  veneratedBy: string | null
  canonization: string | null
  feast: string | null
  patronOf: string | null
}

export type SaintDay = {
  title: string
  biography: string
  image: string | null
  source: SaintDaySource | null
  imageCredit: SaintDayImageCredit | null
  calendar: SaintDayCalendar | null
  life: SaintDayLife | null
  veneration: SaintDayVeneration | null
  factsSource: SaintDaySource | null
}
