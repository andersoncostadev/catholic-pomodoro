import type {
  SaintDay,
  SaintDayCalendar,
  SaintDayImageCredit,
  SaintDayLife,
  SaintDaySource,
  SaintDayVeneration,
} from '@domain/models/saint-day/day'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

export function readSaintDay(body: unknown): SaintDay | null {
  if (!isRecord(body)) return null
  const title = text(body.title)
  const biography = text(body.biography)
  if (!title || !biography) return null

  const image = portrait(body.image)
  return {
    title,
    biography,
    summary: readSummary(body.summary),
    image,
    source: readSource(body.source),
    imageCredit: image ? readImageCredit(body.imageCredit) : null,
    calendar: readCalendar(body.calendar),
    life: readLife(body.life),
    veneration: readVeneration(body.veneration),
    factsSource: readSource(body.factsSource),
  }
}

function readCalendar(value: unknown): SaintDayCalendar | null {
  if (!isRecord(value)) return null
  const name = text(value.name)
  return name ? { name, url: httpsUrl(value.url) } : null
}

function readSummary(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const paragraphs = value.map(text).filter(Boolean)
  return paragraphs.length > 0 ? paragraphs : null
}

function readLife(value: unknown): SaintDayLife | null {
  if (!isRecord(value)) return null
  const life = {
    birth: text(value.birth) || null,
    death: text(value.death) || null,
    burial: text(value.burial) || null,
    order: text(value.order) || null,
  }
  return Object.values(life).some(Boolean) ? life : null
}

function readVeneration(value: unknown): SaintDayVeneration | null {
  if (!isRecord(value)) return null
  const veneration = {
    veneratedBy: text(value.veneratedBy) || null,
    beatification: text(value.beatification) || null,
    canonization: text(value.canonization) || null,
    canonizedBy: text(value.canonizedBy) || null,
    feast: text(value.feast) || null,
    patronOf: text(value.patronOf) || null,
    attributes: text(value.attributes) || null,
  }
  return Object.values(veneration).some(Boolean) ? veneration : null
}

function readSource(value: unknown): SaintDaySource | null {
  if (!isRecord(value)) return null
  const name = text(value.name)
  if (!name) return null
  return {
    name,
    url: httpsUrl(value.url),
    license: text(value.license),
    licenseUrl: httpsUrl(value.licenseUrl),
  }
}

function readImageCredit(value: unknown): SaintDayImageCredit | null {
  if (!isRecord(value)) return null
  const author = text(value.author)
  const license = text(value.license)
  if (!author && !license) return null
  return { author, license, url: httpsUrl(value.url) }
}

function portrait(value: unknown): string | null {
  const url = httpsUrl(value)
  if (!url) return null
  const { search, hash } = new URL(url)
  if (search || hash) return null
  const lower = url.toLowerCase()
  return IMAGE_EXTENSIONS.some((extension) => lower.endsWith(extension)) ? url : null
}

function httpsUrl(value: unknown): string | null {
  const line = text(value)
  if (!line) return null
  try {
    return new URL(line).protocol === 'https:' ? line : null
  } catch {
    return null
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
