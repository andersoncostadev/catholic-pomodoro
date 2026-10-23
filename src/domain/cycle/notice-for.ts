import type { Phase } from '@domain/models/cycle/phase'

export function noticeFor(phase: Phase): string {
  if (phase === 'offering') return 'Oração oferecida. Agora, o foco.'
  if (phase === 'focus') return 'Foco concluído. A pausa é para rezar.'
  if (phase === 'longPause') return 'Pausa longa terminada. Recomece pela oração.'
  return 'Pausa terminada. Recomece pela oração.'
}
