import { ref, watch } from 'vue'

export function useLocalStorage(key, initialValue) {
  // Lecture sécurisée du localStorage
  function readFromStorage() {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.warn(`Erreur lecture localStorage "${key}":`, e)
      // Nettoyer la valeur corrompue
      localStorage.removeItem(key)
    }
    return initialValue
  }

  const value = ref(readFromStorage())

  // Sauvegarde sécurisée
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(value.value))
    } catch (e) {
      console.warn(`Erreur écriture localStorage "${key}":`, e)
    }
  }

  function set(v) {
    value.value = v
    save()
  }

  function push(v) {
    if (Array.isArray(value.value)) {
      // Dédoublonner et limiter à 5 éléments
      const arr = [v, ...value.value.filter(x => x !== v)].slice(0, 5)
      value.value = arr
      save()
    }
  }

  function remove(v) {
    if (Array.isArray(value.value)) {
      value.value = value.value.filter(x => x !== v)
      save()
    }
  }

  function clear() {
    value.value = Array.isArray(initialValue) ? [] : initialValue
    save()
  }

  return { value, set, push, remove, clear }
}
