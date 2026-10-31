import type { IStorage } from '@data/protocols/cache/storage'

export class LocalStorageAdapter implements IStorage {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* armazenamento cheio ou bloqueado: o timer segue só na memória */
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return localStorage.getItem(key) == null
    } catch {
      return false
    }
  }
}
