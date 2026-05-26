import { ref } from 'vue'

/**
 * Persistance localStorage robuste :
 * - Mode privé Safari géré (try/catch interne)
 * - Validation du type au reload (corruption détectée)
 * - Dédup + cap configurable pour les listes
 */
export function useLocalStorage(key, initialValue, { max = 5 } = {}) {
  function safeRemove() {
    try { localStorage.removeItem(key) } catch { /* ignore */ }
  }

  function readFromStorage() {
    try {
      const stored = localStorage.getItem(key)
      if (stored === null) return cloneInitial()
      const parsed = JSON.parse(stored)
      // Validation : si initialValue est un Array, parsed DOIT être un Array
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
        safeRemove()
        return cloneInitial()
      }
      return parsed
    } catch {
      safeRemove()
      return cloneInitial()
    }
  }

  function cloneInitial() {
    if (Array.isArray(initialValue)) return []
    if (initialValue && typeof initialValue === 'object') return { ...initialValue }
    return initialValue
  }

  const value = ref(readFromStorage())

  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(value.value))
    } catch {
      // Quota / privé → silent
    }
  }

  function set(v) {
    value.value = v
    save()
  }

  function push(v) {
    if (!Array.isArray(value.value)) value.value = []
    // Dédoublonne par identité (string) puis cap
    const arr = [v, ...value.value.filter(x => x !== v)].slice(0, max)
    value.value = arr
    save()
  }

  function remove(v) {
    if (!Array.isArray(value.value)) return
    value.value = value.value.filter(x => x !== v)
    save()
  }

  function clear() {
    value.value = cloneInitial()
    save()
  }

  return { value, set, push, remove, clear }
}
