let audioCtx: AudioContext | null = null

export function unlockAudio(): void {
  const Ctx = window.AudioContext
  if (!Ctx) return
  if (!audioCtx) audioCtx = new Ctx()
  if (audioCtx.state === 'suspended') void audioCtx.resume()
}

export function playBell(): void {
  if (!audioCtx) return
  const ctx = audioCtx
  const start = ctx.currentTime
  const strike = (when: number, freq: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, when)
    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(0.18, when + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 2.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(when)
    osc.stop(when + 2.3)
  }
  strike(start, 523.25)
  strike(start + 0.28, 392)
}
