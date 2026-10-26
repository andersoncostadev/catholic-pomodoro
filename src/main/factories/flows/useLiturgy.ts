import { useEffect, useState } from 'react'
import { todayKey } from '@domain/cycle/today-key'
import type { LiturgyDay } from '@domain/models/liturgy/day'
import { makeLoadLiturgy } from '@main/factories/usecases/liturgy/load-liturgy'

const loadLiturgy = makeLoadLiturgy()
const requested = new Map<string, Promise<LiturgyDay | null>>()

function requestLiturgy(day: string): Promise<LiturgyDay | null> {
  const pending = requested.get(day)
  if (pending) return pending
  const next = loadLiturgy.handle(day)
  requested.set(day, next)
  return next
}

export function useLiturgy(): LiturgyDay | null {
  const [dayKey, setDayKey] = useState(todayKey)
  const [loaded, setLoaded] = useState<{ key: string; day: LiturgyDay | null } | null>(null)

  useEffect(() => {
    let active = true
    requestLiturgy(dayKey).then(
      (day) => {
        if (active) setLoaded({ key: dayKey, day })
      },
      () => {
        if (active) setLoaded({ key: dayKey, day: null })
      },
    )
    return () => {
      active = false
    }
  }, [dayKey])

  useEffect(() => {
    const watch = () => {
      const next = todayKey()
      setDayKey((current) => (current === next ? current : next))
    }
    const id = window.setInterval(watch, 1000)
    document.addEventListener('visibilitychange', watch)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', watch)
    }
  }, [])

  return loaded?.key === dayKey ? loaded.day : null
}
