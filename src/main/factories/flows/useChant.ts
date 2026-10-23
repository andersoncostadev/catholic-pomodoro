import { useEffect, useRef, useState } from 'react'
import { chants } from '@domain/catalogs/chants'
import { makeLoadChant } from '@main/factories/usecases/chant/load-chant'
import { makeSaveChant } from '@main/factories/usecases/chant/save-chant'

const loadChant = makeLoadChant()
const saveChant = makeSaveChant()

export function useChant() {
  const saved = useRef(loadChant.handle()).current
  const [trackId, setTrackId] = useState<string | null>(saved.trackId)
  const [volume, setVolume] = useState(saved.volume)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeRef = useRef(volume)
  volumeRef.current = volume

  const playToken = useRef(0)

  function audio() {
    if (!audioRef.current) {
      const element = new Audio()
      element.loop = true
      element.preload = 'none'
      element.onerror = () => {
        setPlaying(false)
        setError('Não encontrei esta gravação.')
      }
      audioRef.current = element
    }
    return audioRef.current
  }

  useEffect(() => {
    saveChant.handle({ trackId, volume })
  }, [trackId, volume])

  useEffect(() => {
    const element = audioRef.current
    if (element) element.volume = volume
  }, [volume])

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  function play(id: string) {
    const chant = chants.find((item) => item.id === id)
    if (!chant) return
    const token = ++playToken.current
    const element = audio()
    element.volume = volumeRef.current
    if (!element.src.endsWith(chant.src)) {
      element.src = chant.src
    }
    setTrackId(id)
    setPlaying(true)
    setError(null)
    void element.play().then(
      () => {
        if (playToken.current !== token) setPlaying(false)
      },
      () => {
        if (playToken.current !== token) return
        setPlaying(false)
        setError('Não foi possível tocar agora. Escolha a faixa de novo.')
      },
    )
  }

  function pause() {
    playToken.current += 1
    audioRef.current?.pause()
    setPlaying(false)
  }

  function choose(id: string | null) {
    if (id === null) {
      pause()
      setTrackId(null)
      setError(null)
      return
    }
    if (id === trackId && playing) {
      pause()
      return
    }
    play(id)
  }

  function setLevel(next: number) {
    const safe = Math.min(1, Math.max(0, next))
    setVolume(safe)
    if (audioRef.current) audioRef.current.volume = safe
  }

  return { trackId, volume, playing, error, choose, setLevel }
}
