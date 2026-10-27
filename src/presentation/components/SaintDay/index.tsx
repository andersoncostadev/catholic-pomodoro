import { useState } from 'react'
import type { SaintDay, SaintDaySource } from '@domain/models/saint-day/day'

export function SaintDayLine({ saint, onOpen }: { saint: SaintDay; onOpen: () => void }) {
  return (
    <button type="button" className="liturgy-line saint-line" onClick={onOpen}>
      <span className="saint-label">Santo do dia:</span>{' '}
      <span>{saint.title}</span>
    </button>
  )
}

export function SaintDayPanel({ saint }: { saint: SaintDay }) {
  const [brokenImage, setBrokenImage] = useState<string | null>(null)
  const image = saint.image && saint.image !== brokenImage ? saint.image : null
  const credit = saint.imageCredit
  const sources = [saint.source, saint.factsSource].filter((source): source is SaintDaySource => source !== null)
  const introduction = saint.summary ?? [saint.biography]

  return (
    <div className="drawer-body saint-body">
      {image ? (
        <figure className="saint-portrait">
          <img src={image} alt={saint.title} referrerPolicy="no-referrer" onError={() => setBrokenImage(image)} />
          {credit ? (
            <figcaption>
              {credit.author ? `Foto: ${credit.author}` : 'Foto'}
              {credit.license ? (
                <>
                  {' · '}
                  <Link href={credit.url}>{credit.license}</Link>
                </>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      <p className="liturgy-title">{saint.title}</p>
      <div className="saint-intro">
        {introduction.map((paragraph, index) => (
          <p key={index} className="liturgy-text">
            {paragraph}
          </p>
        ))}
      </div>
      <Facts
        title="Vida"
        rows={[
          ['Nascimento', saint.life?.birth],
          ['Morte', saint.life?.death],
          ['Sepultura', saint.life?.burial],
          ['Ordem religiosa', saint.life?.order],
        ]}
      />
      <Facts
        title="Veneração"
        rows={[
          ['Venerado por', saint.veneration?.veneratedBy],
          ['Beatificação', saint.veneration?.beatification],
          ['Canonização', saint.veneration?.canonization],
          ['Canonizado por', saint.veneration?.canonizedBy],
          ['Festa', saint.veneration?.feast],
          ['Padroeiro', saint.veneration?.patronOf],
          ['Na arte', saint.veneration?.attributes],
        ]}
      />
      {saint.calendar ? (
        <p className="liturgy-source">
          Calendário: <Link href={saint.calendar.url}>{saint.calendar.name}</Link>
        </p>
      ) : null}
      {sources.length > 0 ? (
        <p className="liturgy-source">
          Fonte:{' '}
          {sources.map((source, index) => (
            <span key={source.name}>
              {index > 0 ? '; ' : null}
              <Link href={source.url}>{source.name}</Link>
              {source.license ? (
                <>
                  {' · '}
                  <Link href={source.licenseUrl}>{source.license}</Link>
                </>
              ) : null}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  )
}

function Facts({ title, rows }: { title: string; rows: [string, string | null | undefined][] }) {
  const filled = rows.filter((row): row is [string, string] => Boolean(row[1]))
  if (filled.length === 0) return null
  return (
    <section>
      <h3>{title}</h3>
      <dl className="saint-facts">
        {filled.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Link({ href, children }: { href: string | null; children: string }) {
  if (!href) return <>{children}</>
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}
