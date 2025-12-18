import axios from 'axios'

// Clé API sécurisée - DOIT être définie dans .env
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY

if (!API_KEY) {
  console.error('⚠️ VITE_OPENWEATHER_KEY manquante dans .env')
}

const BASE = 'https://api.openweathermap.org/data/2.5'
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

// Paramètres par défaut pour toutes les requêtes
const defaultParams = {
  units: 'metric',
  lang: 'fr',
  appid: API_KEY
}

// Cache en mémoire + sessionStorage
const memoryCache = new Map()

function createCacheKey(url, params) {
  return `${url}:${JSON.stringify(params)}`
}

function getFromCache(key) {
  // Essayer mémoire d'abord
  const memCached = memoryCache.get(key)
  if (memCached) return memCached

  // Essayer sessionStorage
  try {
    const stored = sessionStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    // sessionStorage peut échouer en navigation privée
    console.warn('sessionStorage non disponible:', e)
  }
  return null
}

function setToCache(key, data) {
  const pack = { timestamp: Date.now(), data }
  memoryCache.set(key, pack)

  try {
    sessionStorage.setItem(key, JSON.stringify(pack))
  } catch (e) {
    // Ignorer les erreurs de stockage
  }
}

async function request(url, params) {
  if (!API_KEY) {
    throw new Error('Clé API OpenWeather non configurée')
  }

  const cacheKey = createCacheKey(url, params)
  const cached = getFromCache(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const { data } = await axios.get(url, { params })
  setToCache(cacheKey, data)
  return data
}

export function getCurrentByCity(q) {
  return request(`${BASE}/weather`, { ...defaultParams, q })
}

export function getForecastByCity(q) {
  return request(`${BASE}/forecast`, { ...defaultParams, q })
}

export function getCurrentByCoords(lat, lon) {
  return request(`${BASE}/weather`, { ...defaultParams, lat, lon })
}

export function getForecastByCoords(lat, lon) {
  return request(`${BASE}/forecast`, { ...defaultParams, lat, lon })
}

// Utilitaire pour vérifier la configuration
export function isApiConfigured() {
  return !!API_KEY
}
