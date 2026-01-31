import axios from 'axios'

// Clé API sécurisée - DOIT être définie dans .env
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY

if (!API_KEY) {
  console.error('⚠️ VITE_OPENWEATHER_KEY manquante dans .env')
}

const BASE = 'https://api.openweathermap.org/data/2.5'
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

// Paramètres par défaut pour toutes les requêtes
function getDefaultParams(lang = 'fr') {
  return {
    units: 'metric',
    lang,
    appid: API_KEY
  }
}

// Cache en mémoire + sessionStorage
const memoryCache = new Map()

// AbortController pour annuler les requêtes en cours
let currentController = null

function createCacheKey(url, params) {
  return `${url}:${JSON.stringify(params)}`
}

function getFromCache(key) {
  // Essayer mémoire d'abord
  const memCached = memoryCache.get(key)
  if (memCached && Date.now() - memCached.timestamp < CACHE_TTL) return memCached

  // Essayer sessionStorage
  try {
    const stored = sessionStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        memoryCache.set(key, parsed)
        return parsed
      }
      sessionStorage.removeItem(key)
    }
  } catch (e) {
    // sessionStorage peut échouer en navigation privée
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

export function cancelPendingRequests() {
  if (currentController) {
    currentController.abort()
    currentController = null
  }
}

async function request(url, params, signal) {
  if (!API_KEY) {
    throw new Error('Clé API OpenWeather non configurée')
  }

  const cacheKey = createCacheKey(url, params)
  const cached = getFromCache(cacheKey)

  if (cached) {
    return cached.data
  }

  const { data } = await axios.get(url, { params, signal })
  setToCache(cacheKey, data)
  return data
}

export function createRequestGroup() {
  cancelPendingRequests()
  currentController = new AbortController()
  return currentController.signal
}

export function getCurrentByCity(q, signal, lang) {
  return request(`${BASE}/weather`, { ...getDefaultParams(lang), q }, signal)
}

export function getForecastByCity(q, signal, lang) {
  return request(`${BASE}/forecast`, { ...getDefaultParams(lang), q }, signal)
}

export function getCurrentByCoords(lat, lon, signal, lang) {
  return request(`${BASE}/weather`, { ...getDefaultParams(lang), lat, lon }, signal)
}

export function getForecastByCoords(lat, lon, signal, lang) {
  return request(`${BASE}/forecast`, { ...getDefaultParams(lang), lat, lon }, signal)
}

// Utilitaire pour vérifier la configuration
export function isApiConfigured() {
  return !!API_KEY
}
