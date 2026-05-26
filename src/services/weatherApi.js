import axios from 'axios'

// Clé API — DOIT être définie dans .env (VITE_OPENWEATHER_KEY)
// ATTENTION : toute variable VITE_* est inlinée dans le bundle client.
// En production, faire passer la clé par un proxy serverless.
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY

if (!API_KEY) {
  // eslint-disable-next-line no-console
  console.error('[WeatherPro] VITE_OPENWEATHER_KEY missing in .env')
}

const BASE = 'https://api.openweathermap.org/data/2.5'
const REQUEST_TIMEOUT = 10_000 // 10s
const CACHE_TTL_CURRENT = 1000 * 60 * 5   // 5 min pour current
const CACHE_TTL_FORECAST = 1000 * 60 * 15 // 15 min pour forecast
const MEMORY_CACHE_LIMIT = 50 // LRU max entries

function getDefaultParams(lang = 'fr') {
  return { units: 'metric', lang, appid: API_KEY }
}

// Cache mémoire LRU + sessionStorage
const memoryCache = new Map()

// AbortController centralisé : un par groupe de requêtes
let currentController = null

function createCacheKey(url, params) {
  // On exclut appid pour ne pas écrire la clé API dans le sessionStorage
  const { appid, ...rest } = params
  return `${url}:${JSON.stringify(rest)}`
}

function lruTouch(key, value) {
  if (memoryCache.has(key)) memoryCache.delete(key)
  memoryCache.set(key, value)
  if (memoryCache.size > MEMORY_CACHE_LIMIT) {
    // Supprime l'entrée la plus ancienne (premier item de Map)
    const oldestKey = memoryCache.keys().next().value
    memoryCache.delete(oldestKey)
  }
}

function getFromCache(key, ttl) {
  const memCached = memoryCache.get(key)
  if (memCached && Date.now() - memCached.timestamp < ttl) {
    // Touch LRU
    memoryCache.delete(key)
    memoryCache.set(key, memCached)
    return memCached
  }

  try {
    const stored = sessionStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < ttl) {
        lruTouch(key, parsed)
        return parsed
      }
      sessionStorage.removeItem(key)
    }
  } catch {
    // sessionStorage indisponible (mode privé) → silent
  }
  return null
}

function setToCache(key, data) {
  const pack = { timestamp: Date.now(), data }
  lruTouch(key, pack)
  try {
    sessionStorage.setItem(key, JSON.stringify(pack))
  } catch {
    // Quota dépassé / privé → silent
  }
}

export function cancelPendingRequests() {
  if (currentController) {
    currentController.abort()
    currentController = null
  }
}

export function createRequestGroup() {
  cancelPendingRequests()
  currentController = new AbortController()
  return currentController.signal
}

function isAborted(signal) {
  return signal && signal.aborted
}

async function request(url, params, signal, ttl) {
  if (!API_KEY) {
    throw new Error('OpenWeather API key not configured')
  }

  // Respect explicite du signal d'abort, même pour le cache
  if (isAborted(signal)) {
    throw new DOMException('Aborted', 'AbortError')
  }

  const cacheKey = createCacheKey(url, params)
  const cached = getFromCache(cacheKey, ttl)
  if (cached) return cached.data

  // Re-vérification au cas où l'utilisateur a annulé pendant le lookup cache
  if (isAborted(signal)) {
    throw new DOMException('Aborted', 'AbortError')
  }

  const { data } = await axios.get(url, {
    params,
    signal,
    timeout: REQUEST_TIMEOUT
  })
  setToCache(cacheKey, data)
  return data
}

export function getCurrentByCity(q, signal, lang) {
  return request(`${BASE}/weather`, { ...getDefaultParams(lang), q }, signal, CACHE_TTL_CURRENT)
}

export function getForecastByCity(q, signal, lang) {
  return request(`${BASE}/forecast`, { ...getDefaultParams(lang), q }, signal, CACHE_TTL_FORECAST)
}

export function getCurrentByCoords(lat, lon, signal, lang) {
  return request(`${BASE}/weather`, { ...getDefaultParams(lang), lat, lon }, signal, CACHE_TTL_CURRENT)
}

export function getForecastByCoords(lat, lon, signal, lang) {
  return request(`${BASE}/forecast`, { ...getDefaultParams(lang), lat, lon }, signal, CACHE_TTL_FORECAST)
}

export function isApiConfigured() {
  return !!API_KEY
}
