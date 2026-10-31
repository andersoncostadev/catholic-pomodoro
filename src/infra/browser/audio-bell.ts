let audioCtx: AudioContext | null = null

export function unlockAudio(): void {
  const Ctx = window.AudioContext
  if (!Ctx) return
  if (!audioCtx) audioCtx = new Ctx()
  if (audioCtx.state === 'suspended') void audioCtx.resume()
}

export function playBell(volume = 100, repeat = false): void {
  if (!audioCtx) return
  const level = Math.min(100, Math.max(0, volume)) / 100
  const peak = 0.18 * level
  if (!(peak > 0.0001)) return
  const ctx = audioCtx
  const start = ctx.currentTime
  const strike = (when: number, freq: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, when)
    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(peak, when + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 2.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(when)
    osc.stop(when + 2.3)
  }
  const pair = (origin: number) => {
    strike(origin, 523.25)
    strike(origin + 0.28, 392)
  }
  pair(start)
  if (repeat) pair(start + 2.4)
}
