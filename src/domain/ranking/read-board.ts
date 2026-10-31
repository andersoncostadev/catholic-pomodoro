import type { RankingBoard, RankingRow } from '../models/ranking/board'
import { nicknameOrNull } from './nickname'

const weekMaxSeconds = 7 * 57600

export function readRankingBoard(body: unknown): RankingBoard | null {
  if (!isRecord(body) || 'id' in body) return null
  if (typeof body.weekStart !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.weekStart)) return null
  if (!Array.isArray(body.rows) || body.rows.length > 20) return null

  const rows: RankingRow[] = []
  for (let index = 0; index < body.rows.length; index += 1) {
    const row = readRow(body.rows[index])
    if (!row || row.place !== index + 1) return null
    rows.push(row)
  }

  if (!('me' in body)) return null
  if (body.me === null) return { weekStart: body.weekStart, rows, me: null }
  const me = readRow(body.me)
  if (!me) return null
  return { weekStart: body.weekStart, rows, me }
}

function readRow(value: unknown): RankingRow | null {
  if (!isRecord(value) || 'id' in value) return null
  if (typeof value.place !== 'number' || !Number.isInteger(value.place) || value.place < 1) return null
  if (typeof value.name !== 'string') return null
  const name = nicknameOrNull(value.name)
  if (name == null || name !== value.name) return null
  if (typeof value.seconds !== 'number' || !Number.isInteger(value.seconds)) return null
  if (value.seconds < 1 || value.seconds > weekMaxSeconds) return null
  return { place: value.place, name, seconds: value.seconds }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
