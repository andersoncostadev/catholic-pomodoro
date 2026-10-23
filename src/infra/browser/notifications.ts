export function askNotification(): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') void Notification.requestPermission()
}

export function notifyIfHidden(body: string): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted' || !document.hidden) return
  try {
    new Notification('Pomodoro Católico', { body })
  } catch {
    /* alguns navegadores recusam a notificação sem quebrar o ciclo */
  }
}
