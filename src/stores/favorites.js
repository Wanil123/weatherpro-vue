import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref(loadFromStorage())
  const MAX_FAVORITES = 10

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem('wp_favorites')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem('wp_favorites', JSON.stringify(favorites.value))
    } catch (e) {
      console.warn('Erreur sauvegarde favoris:', e)
    }
  }

  function add(city) {
    if (!city || favorites.value.some(f => f.name.toLowerCase() === city.toLowerCase())) {
      return false
    }

    const favorite = {
      id: Date.now(),
      name: city,
      addedAt: new Date().toISOString()
    }

    favorites.value.unshift(favorite)

    // Limiter le nombre de favoris
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
    return favorites.value.some(f => f.name.toLowerCase() === city.toLowerCase())
  }

  function toggle(city) {
    const existing = favorites.value.find(f => f.name.toLowerCase() === city.toLowerCase())
    if (existing) {
      remove(existing.id)
      return false
    } else {
      add(city)
      return true
    }
  }

  function clear() {
    favorites.value = []
    saveToStorage()
  }

  const count = computed(() => favorites.value.length)
  const isEmpty = computed(() => favorites.value.length === 0)

  return {
    favorites,
    count,
    isEmpty,
    add,
    remove,
    isFavorite,
    toggle,
    clear
  }
})
