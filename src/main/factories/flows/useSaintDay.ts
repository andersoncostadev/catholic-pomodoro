import { useEffect, useState } from 'react'
import { todayKey } from '@domain/cycle/today-key'
import type { SaintDay } from '@domain/models/saint-day/day'
import { monthDayOf } from '@domain/saint-day/month-day'
import { makeLoadSaint } from '@main/factories/usecases/saint-day/load-saint'

const loadSaint = makeLoadSaint()
const requested = new Map<string, Promise<SaintDay | null>>()

function requestSaint(dayKey: string): Promise<SaintDay | null> {
  const pending = requested.get(dayKey)
  if (pending) return pending
  const monthDay = monthDayOf(dayKey)
  const next = monthDay ? loadSaint.handle(monthDay) : Promise.resolve(null)
  requested.set(dayKey, next)
  return next
}

export function useSaintDay(): SaintDay | null {
  const [dayKey, setDayKey] = useState(todayKey)
  const [loaded, setLoaded] = useState<{ key: string; saint: SaintDay | null } | null>(null)

  useEffect(() => {
    let active = true
    requestSaint(dayKey).then(
      (saint) => {
        if (active) setLoaded({ key: dayKey, saint })
      },
      () => {
        if (active) setLoaded({ key: dayKey, saint: null })
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

  return loaded?.key === dayKey ? loaded.saint : null
}
