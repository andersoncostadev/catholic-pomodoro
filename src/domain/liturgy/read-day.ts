import type { LiturgyDay, LiturgyReading } from '@domain/models/liturgy/day'

export function readLiturgyDay(body: unknown): LiturgyDay | null {
  if (!Array.isArray(body) || body.length === 0) return null
  const item = body[0]
  if (!isRecord(item)) return null
  if ('celebracoes' in item && !Array.isArray(item.celebracoes)) return null

  const celebration = pickCelebration(item.celebracoes)
  const title = text(celebration?.liturgia) || text(item.nome)
  if (!title) return null

  const antiphons = isRecord(celebration?.antifonas) ? celebration.antifonas : null
  const prayers = isRecord(celebration?.oracoes) ? celebration.oracoes : null

  return {
    title,
    color: text(celebration?.cor),
    entrance: optionalText(antiphons?.entrada),
    collect: optionalText(prayers?.coleta),
    readings: readReadings(celebration?.leituras),
    communion: optionalText(antiphons?.comunhao),
  }
}

function pickCelebration(value: unknown): Record<string, unknown> | null {
  if (!Array.isArray(value)) return null
  const celebrations = value.filter(isRecord)
  return celebrations.find((item) => item.principal === true) ?? celebrations[0] ?? null
}

function readReadings(value: unknown): LiturgyReading[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const delta = rank(a.item) - rank(b.item)
      return delta !== 0 ? delta : a.index - b.index
    })
    .map(({ item }) => readReading(item))
    .filter((reading): reading is LiturgyReading => reading !== null)
}

function readReading(value: unknown): LiturgyReading | null {
  if (!isRecord(value) || !Array.isArray(value.opcoes) || value.opcoes.length === 0) return null
  const option = value.opcoes[0]
  if (!isRecord(option)) return null
  const reference = text(option.referencia)
  const body = text(option.texto)
  if (!reference || !body) return null
  return {
    label: text(value.rotulo),
    reference,
    text: body,
    title: optionalText(option.titulo),
    refrain: optionalText(option.refrao),
  }
}

function rank(value: unknown): number {
  if (!isRecord(value)) return Number.POSITIVE_INFINITY
  return typeof value.ordem === 'number' && Number.isFinite(value.ordem) ? value.ordem : Number.POSITIVE_INFINITY
}

function optionalText(value: unknown): string | null {
  const line = text(value)
  return line || null
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
