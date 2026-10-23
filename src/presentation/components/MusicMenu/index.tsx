import { useEffect, useRef, useState } from 'react'
import { chants } from '@domain/catalogs/chants'
import { useChant } from '@main/factories/flows/useChant'

export function MusicMenu({ dismiss, onOpen }: { dismiss: boolean; onOpen: () => void }) {
  const { trackId, volume, playing, error, choose, setLevel } = useChant()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current = chants.find((chant) => chant.id === trackId)

  useEffect(() => {
    if (dismiss) setOpen(false)
  }, [dismiss])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (rootRef.current?.contains(event.target)) return
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div className="music" ref={rootRef}>
      <button
        type="button"
        className={playing ? 'icon-btn is-live' : 'icon-btn'}
        aria-label={playing && current ? `Música, tocando ${current.title}` : 'Música'}
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => {
            const next = !value
            if (next) onOpen()
            return next
          })
        }}
      >
        <MusicIcon />
      </button>
      {open ? (
        <div className="music-panel" role="dialog" aria-label="Música gregoriana">
          <h2>Canto gregoriano</h2>
          <p>Um fundo para o foco. Pode ficar em silêncio na hora da oração.</p>
          <div className="track-list" role="listbox" aria-label="Faixas">
            <button
              type="button"
              className={trackId === null ? 'track is-on' : 'track'}
              role="option"
              aria-selected={trackId === null}
              onClick={() => choose(null)}
            >
              <span>
                <strong>Silêncio</strong>
                <small>Sem música</small>
              </span>
            </button>
            {chants.map((chant) => {
              const active = trackId === chant.id
              return (
                <button
                  key={chant.id}
                  type="button"
                  className={active ? 'track is-on' : 'track'}
                  role="option"
                  aria-selected={active}
                  onClick={() => choose(chant.id)}
                >
                  <span>
                    <strong>{chant.title}</strong>
                    <small>{chant.subtitle}</small>
                  </span>
                  <em>{active && playing ? 'Tocando' : active ? 'Pausado' : 'Ouvir'}</em>
                </button>
              )
            })}
          </div>
          <label className="volume">
            <span>Volume</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              aria-valuetext={`${Math.round(volume * 100)} por cento`}
              onChange={(event) => setLevel(Number(event.target.value) / 100)}
            />
          </label>
          {error ? <p className="music-error">{error}</p> : null}
          <details className="music-credit">
            <summary>Fontes e licenças</summary>
            <ul>
              {chants.map((chant) => (
                <li key={chant.id}>
                  {chant.title}: {chant.credit}.{' '}
                  <a href={chant.licenseUrl} target="_blank" rel="noreferrer">
                    {chant.license}
                  </a>
                  {' · '}
                  <a href={chant.sourceUrl} target="_blank" rel="noreferrer">
                    fonte
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      ) : null}
    </div>
  )
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 17.2a2.1 2.1 0 1 1-2.1-2.1V6.4L18 4.5v8.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.2" cy="15.2" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}
