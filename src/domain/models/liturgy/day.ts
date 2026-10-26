export type LiturgyReading = {
  label: string
  reference: string
  text: string
  title: string | null
  refrain: string | null
}

export type LiturgyDay = {
  title: string
  color: string
  entrance: string | null
  collect: string | null
  readings: LiturgyReading[]
  communion: string | null
}
