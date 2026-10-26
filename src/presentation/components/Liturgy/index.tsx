import { useRef, type ReactNode } from 'react'
import type { LiturgyDay, LiturgyReading } from '@domain/models/liturgy/day'

const BEADS = {
  branco: 'branco',
  verde: 'verde',
  vermelho: 'vermelho',
  roxo: 'roxo',
  rosa: 'rosa',
} as const

type Bead = keyof typeof BEADS

type Jump = {
  id: string
  label: string
}

export function LiturgyLine({ day, onOpen }: { day: LiturgyDay; onOpen: () => void }) {
  const bead = liturgyBead(day.color)
  const label = day.color ? `${day.color}. ${day.title}` : day.title
  return (
    <button type="button" className="liturgy-line" aria-label={label} onClick={onOpen}>
      {bead ? <i className="liturgy-bead" data-liturgy={bead} aria-hidden="true" /> : day.color ? <span>{day.color}</span> : null}
      <span>{day.title}</span>
    </button>
  )
}

export function LiturgyPanel({ day }: { day: LiturgyDay }) {
  const scroller = useRef<HTMLDivElement>(null)
  const bead = liturgyBead(day.color)
  const readings = markedReadings(day.readings)
  const jumps = jumpLinks(day.collect != null, readings)

  function showSection(id: string) {
    const root = scroller.current
    const target = root?.querySelector<HTMLElement>(`#${id}`)
    if (!root || !target) return
    const top = target.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    root.scrollTo({ top, behavior: motion })
  }

  return (
    <div className="drawer-body liturgy-body" ref={scroller}>
      {day.color ? (
        <p className="liturgy-color">
          {bead ? <i className="liturgy-bead" data-liturgy={bead} aria-hidden="true" /> : null}
          <span>{day.color}</span>
        </p>
      ) : null}
      <p className="liturgy-title">{day.title}</p>
      {jumps.length > 0 ? (
        <nav className="liturgy-jump" aria-label="Seções da liturgia">
          {jumps.map((jump) => (
            <button key={jump.id} type="button" onClick={() => showSection(jump.id)}>
              {jump.label}
            </button>
          ))}
        </nav>
      ) : null}
      {day.entrance ? <Block title="Antífona de entrada" text={day.entrance} /> : null}
      {day.collect ? (
        <section id="liturgia-coleta">
          <h3>Coleta</h3>
          <p className="liturgy-text">{day.collect}</p>
        </section>
      ) : null}
      {readings.map((reading) => (
        <section key={reading.key} id={reading.id}>
          {reading.label ? <h3>{reading.label}</h3> : null}
          {reading.title ? <p className="liturgy-reading-title">{reading.title}</p> : null}
          <p className="liturgy-reference">{reading.reference}</p>
          {reading.refrain ? <p className="liturgy-refrain">{reading.refrain}</p> : null}
          <p className="liturgy-text">{withVerses(reading.text)}</p>
        </section>
      ))}
      {day.communion ? <Block title="Antífona de comunhão" text={day.communion} /> : null}
      <p className="liturgy-source">rito romano, CNBB, via liturgia.cloudhub.ia.br</p>
    </div>
  )
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h3>{title}</h3>
      <p className="liturgy-text">{text}</p>
    </section>
  )
}

function markedReadings(readings: LiturgyReading[]) {
  let salmo = false
  let evangelho = false
  return readings.map((reading, index) => {
    const name = reading.label.toLocaleLowerCase('pt-BR')
    let id: string | undefined
    if (!salmo && name.includes('salmo')) {
      salmo = true
      id = 'liturgia-salmo'
    } else if (!evangelho && name.includes('evangelho')) {
      evangelho = true
      id = 'liturgia-evangelho'
    }
    return { ...reading, id, key: `${reading.reference}-${index}` }
  })
}

function jumpLinks(hasCollect: boolean, readings: { id?: string }[]): Jump[] {
  const jumps: Jump[] = []
  if (hasCollect) jumps.push({ id: 'liturgia-coleta', label: 'Coleta' })
  if (readings.some((reading) => reading.id === 'liturgia-salmo')) jumps.push({ id: 'liturgia-salmo', label: 'Salmo' })
  if (readings.some((reading) => reading.id === 'liturgia-evangelho')) jumps.push({ id: 'liturgia-evangelho', label: 'Evangelho' })
  return jumps
}

function withVerses(text: string) {
  const nodes: ReactNode[] = []
  const pattern = /(\d+)(?=\p{L})/gu
  let cursor = 0
  let index = 0
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0
    if (start > cursor) nodes.push(text.slice(cursor, start))
    nodes.push(<sup key={index}>{match[1]}</sup>)
    nodes.push('\u2009')
    index += 1
    cursor = start + match[1].length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

function liturgyBead(color: string): Bead | null {
  const key = color.trim().toLocaleLowerCase('pt-BR')
  if (!Object.hasOwn(BEADS, key)) return null
  return BEADS[key as Bead]
}
