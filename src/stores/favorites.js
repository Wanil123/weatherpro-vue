import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'wp_favorites'
const MAX_FAVORITES = 10

// Génère un ID unique même sans crypto.randomUUID (vieux navigateurs)
function uuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    // Validation stricte du shape
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(f => f && typeof f === 'object' && typeof f.name === 'string')
      .map(f => ({
        id: f.id ?? uuid(),
        name: f.name,
        addedAt: f.addedAt ?? new Date().toISOString()
      }))
      .slice(0, MAX_FAVORITES)
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref(loadFromStorage())

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    } catch {
      // ignore
    }
  }

  function normalize(city) {
    return typeof city === 'string' ? city.trim().toLowerCase() : ''
  }

  function add(city) {
    if (!city || typeof city !== 'string') return false
    const n = normalize(city)
    if (!n) return false
    if (favorites.value.some(f => normalize(f.name) === n)) return false

    favorites.value.unshift({
      id: uuid(),
      name: city.trim(),
      addedAt: new Date().toISOString()
    })

    if (favorites.value.length > MAX_FAVORITES) {
      favorites.value = favorites.value.slice(0, MAX_FAVORITES)
    }
    saveToStorage()
    return true
  }

  function remove(id) {
    favorites.value = favorites.value.filter(f => f.id !== id)
    saveToStorage()
  }

  function isFavorite(city) {
    const n = normalize(city)
    return favorites.value.some(f => normalize(f.name) === n)
  }

  function toggle(city) {
    const n = normalize(city)
    const existing = favorites.value.find(f => normalize(f.name) === n)
    if (existing) {
      remove(existing.id)
      return false
    }
    return add(city)
  }

  function clear() {
    favorites.value = []
    saveToStorage()
  }

  const count = computed(() => favorites.value.length)
  const isEmpty = computed(() => favorites.value.length === 0)

  return { favorites, count, isEmpty, add, remove, isFavorite, toggle, clear }
})
