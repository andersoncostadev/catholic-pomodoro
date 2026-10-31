import { rankingDayMaxSeconds, rankingFocusMaxSeconds, rankingHourMaxPosts } from '../../src/domain/ranking/focus-seconds'
import { nicknameOrNull } from '../../src/domain/ranking/nickname'
import { uuidOrNull } from '../../src/domain/ranking/uuid'

const ZONE = 'America/Sao_Paulo'
const nameOrder = new Intl.Collator('pt')

type D1Result<T> = { results?: T[] }
type D1Run = { meta?: { changes?: number } }
type D1Prepared = {
  bind(...values: unknown[]): D1Prepared
  first<T>(): Promise<T | null>
  all<T>(): Promise<D1Result<T>>
  run(): Promise<D1Run>
}
type D1Database = {
  prepare(query: string): D1Prepared
  batch(statements: D1Prepared[]): Promise<D1Run[]>
}
type RankingEnv = { RANKING_DB: D1Database }
type RankingContext = { request: Request; env: RankingEnv }
type Clock = { day: string; hourKey: string; weekStart: string }
type Entry = { id: string; name: string; seconds: number }
type PublicRow = { place: number; name: string; seconds: number }
type WorkerCache = {
  match(request: Request): Promise<Response | undefined>
  put(request: Request, response: Response): Promise<void>
}

export async function onRequest(context: RankingContext): Promise<Response> {
  try {
    const method = context.request.method
    if (method === 'GET') return await getRanking(context)
    if (method === 'POST') return await postRanking(context)
    if (method === 'DELETE') return await deleteRanking(context)
    return empty(405)
  } catch {
    return empty(500)
  }
}

async function getRanking(context: RankingContext): Promise<Response> {
  const clock = brasiliaNow()
  const rows = await cachedTop(context.env.RANKING_DB, clock.weekStart)
  const id = uuidOrNull(new URL(context.request.url).searchParams.get('id'))
  const me = id ? await findMe(context.env.RANKING_DB, clock.weekStart, id) : null
  return new Response(JSON.stringify({ weekStart: clock.weekStart, rows, me }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'private, no-store',
    },
  })
}

async function postRanking(context: RankingContext): Promise<Response> {
  const parsed = parsePost(await readJson(context.request))
  if (parsed === 'bad') return empty(400)
  if (parsed === 'too-long') return empty(422)

  const clock = brasiliaNow()
  const db = context.env.RANKING_DB
  if (parsed.seconds == null) {
    await db
      .prepare('UPDATE week_total SET name = ?1 WHERE id = ?2 AND week_start = ?3')
      .bind(parsed.name, parsed.id, clock.weekStart)
      .run()
    await purge(db, clock)
    return empty(204)
  }

  const hour = await db
    .prepare('SELECT posts FROM hour_post WHERE id = ?1 AND hour_key = ?2')
    .bind(parsed.id, clock.hourKey)
    .first<{ posts: number }>()
  if (hour && Number(hour.posts) >= rankingHourMaxPosts) return empty(429)

  const day = await db
    .prepare('SELECT seconds FROM day_total WHERE id = ?1 AND day = ?2')
    .bind(parsed.id, clock.day)
    .first<{ seconds: number }>()
  if (day && Number(day.seconds) + parsed.seconds > rankingDayMaxSeconds) return empty(422)

  await db.batch([
    db
      .prepare(
        `INSERT INTO week_total (id, week_start, name, seconds) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(id, week_start) DO UPDATE SET
           name = excluded.name,
           seconds = week_total.seconds + excluded.seconds`,
      )
      .bind(parsed.id, clock.weekStart, parsed.name, parsed.seconds),
    db
      .prepare(
        `INSERT INTO day_total (id, day, seconds) VALUES (?1, ?2, ?3)
         ON CONFLICT(id, day) DO UPDATE SET seconds = day_total.seconds + excluded.seconds`,
      )
      .bind(parsed.id, clock.day, parsed.seconds),
    db
      .prepare(
        `INSERT INTO hour_post (id, hour_key, posts) VALUES (?1, ?2, 1)
         ON CONFLICT(id, hour_key) DO UPDATE SET posts = hour_post.posts + 1`,
      )
      .bind(parsed.id, clock.hourKey),
    ...purgeStatements(db, clock),
  ])
  return empty(204)
}

async function deleteRanking(context: RankingContext): Promise<Response> {
  const body = await readJson(context.request)
  if (!isRecord(body)) return empty(400)
  const id = uuidOrNull(body.id)
  if (!id) return empty(400)
  const db = context.env.RANKING_DB
  await db.batch([
    db.prepare('DELETE FROM week_total WHERE id = ?1').bind(id),
    db.prepare('DELETE FROM day_total WHERE id = ?1').bind(id),
    db.prepare('DELETE FROM hour_post WHERE id = ?1').bind(id),
  ])
  return empty(204)
}

function parsePost(body: unknown): { id: string; name: string; seconds: number | null } | 'bad' | 'too-long' {
  if (!isRecord(body)) return 'bad'
  const id = uuidOrNull(body.id)
  const name = nicknameOrNull(body.name)
  if (!id || !name) return 'bad'
  if (!Object.hasOwn(body, 'seconds') || body.seconds === 0) return { id, name, seconds: null }
  if (typeof body.seconds !== 'number' || !Number.isInteger(body.seconds)) return 'bad'
  if (body.seconds > rankingFocusMaxSeconds) return 'too-long'
  if (body.seconds < 1) return 'bad'
  return { id, name, seconds: body.seconds }
}

async function cachedTop(db: D1Database, weekStart: string): Promise<PublicRow[]> {
  const cache = workerCache()
  const key = new Request(`https://catholic-pomodoro.pages.dev/internal/ranking-top/${weekStart}`)
  if (cache) {
    try {
      const hit = await cache.match(key)
      if (hit) {
        const parsed = publicRows(await hit.json())
        if (parsed) return parsed
      }
    } catch {
      /* a consulta segue */
    }
  }

  const rows = await queryTop(db, weekStart)
  if (cache) {
    try {
      await cache.put(
        key,
        new Response(JSON.stringify(rows), { headers: { 'cache-control': 'public, max-age=60' } }),
      )
    } catch {
      /* a resposta segue sem cache */
    }
  }
  return rows
}

async function queryTop(db: D1Database, weekStart: string): Promise<PublicRow[]> {
  const listed = await db
    .prepare(
      `SELECT id, name, seconds
       FROM week_total
       WHERE week_start = ?1
         AND seconds > 0
         AND seconds >= COALESCE((
           SELECT seconds
           FROM week_total
           WHERE week_start = ?1 AND seconds > 0
           ORDER BY seconds DESC
           LIMIT 1 OFFSET 19
         ), 0)`,
    )
    .bind(weekStart)
    .all<Entry>()
  const entries = (listed.results ?? []).map((entry) => ({
    id: String(entry.id),
    name: String(entry.name),
    seconds: Number(entry.seconds),
  }))
  return entries.sort(byRank).slice(0, 20).map((entry, index) => ({
    place: index + 1,
    name: entry.name,
    seconds: entry.seconds,
  }))
}

async function findMe(db: D1Database, weekStart: string, id: string): Promise<PublicRow | null> {
  const entry = await db
    .prepare('SELECT id, name, seconds FROM week_total WHERE id = ?1 AND week_start = ?2 AND seconds > 0')
    .bind(id, weekStart)
    .first<Entry>()
  if (!entry || !Number.isInteger(Number(entry.seconds)) || Number(entry.seconds) < 1) return null
  const mine = { id: entry.id, name: entry.name, seconds: Number(entry.seconds) }
  const ahead = await db
    .prepare('SELECT COUNT(*) AS total FROM week_total WHERE week_start = ?1 AND seconds > ?2')
    .bind(weekStart, mine.seconds)
    .first<{ total: number }>()
  const ties = await db
    .prepare('SELECT id, name FROM week_total WHERE week_start = ?1 AND seconds = ?2')
    .bind(weekStart, mine.seconds)
    .all<{ id: string; name: string }>()
  const before = (ties.results ?? []).filter((row) => row.id !== mine.id && nameThenId(row, mine) < 0).length
  return { place: Number(ahead?.total ?? 0) + before + 1, name: mine.name, seconds: mine.seconds }
}

function purgeStatements(db: D1Database, clock: Clock): D1Prepared[] {
  const weekCutoff = shiftDate(clock.weekStart, -56)
  const dayCutoff = shiftDate(clock.day, -62)
  return [
    db.prepare('DELETE FROM week_total WHERE week_start < ?1').bind(weekCutoff),
    db.prepare('DELETE FROM day_total WHERE day < ?1').bind(dayCutoff),
    db.prepare('DELETE FROM hour_post WHERE hour_key < ?1').bind(dayCutoff),
  ]
}

async function purge(db: D1Database, clock: Clock): Promise<void> {
  await db.batch(purgeStatements(db, clock))
}

function byRank(a: Entry, b: Entry): number {
  if (a.seconds !== b.seconds) return b.seconds - a.seconds
  return nameThenId(a, b)
}

function nameThenId(a: { id: string; name: string }, b: { id: string; name: string }): number {
  const byName = nameOrder.compare(a.name, b.name)
  if (byName !== 0) return byName
  if (a.id < b.id) return -1
  if (a.id > b.id) return 1
  return 0
}

function publicRows(value: unknown): PublicRow[] | null {
  if (!Array.isArray(value) || value.length > 20) return null
  const rows: PublicRow[] = []
  for (let index = 0; index < value.length; index += 1) {
    const item = value[index]
    if (!isRecord(item) || 'id' in item) return null
    if (item.place !== index + 1) return null
    const name = nicknameOrNull(item.name)
    if (typeof item.name !== 'string' || name !== item.name) return null
    if (typeof item.seconds !== 'number' || !Number.isInteger(item.seconds) || item.seconds < 1) return null
    rows.push({ place: item.place as number, name, seconds: item.seconds })
  }
  return rows
}

function brasiliaNow(date = new Date()): Clock {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  const day = `${read('year')}-${read('month')}-${read('day')}`
  const rawHour = read('hour') === '24' ? '0' : read('hour')
  const hour = String(Number(rawHour)).padStart(2, '0')
  return { day, hourKey: `${day}T${hour}`, weekStart: shiftDate(day, -daysFromMonday(day)) }
}

function daysFromMonday(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return (weekday + 6) % 7
}

function shiftDate(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  const next = new Date(Date.UTC(year, month - 1, day) + days * 86400000)
  const monthText = String(next.getUTCMonth() + 1).padStart(2, '0')
  const dayText = String(next.getUTCDate()).padStart(2, '0')
  return `${next.getUTCFullYear()}-${monthText}-${dayText}`
}

function workerCache(): WorkerCache | null {
  const host = globalThis as { caches?: { default?: WorkerCache } }
  return host.caches?.default ?? null
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function empty(status: number): Response {
  return new Response(null, { status })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
