const nicknamePattern = /^[\p{L}\p{Nd} '\u2019-]{2,24}$/u

export function nicknameOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null
  if (/[<>\r\n]/.test(value)) return null
  const name = value.trim().replace(/[ \t\f\v\u00a0]+/g, ' ')
  if (!nicknamePattern.test(name)) return null
  return name
}
