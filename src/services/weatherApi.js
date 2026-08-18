import axios from 'axios'

// ────────────────────────────────────────────────────────────────────────────
// Fournisseur météo : Open-Meteo (100 % gratuit, AUCUNE clé API requise).
//   • Prévisions  : https://api.open-meteo.com/v1/forecast
//   • Géocodage   : https://geocoding-api.open-meteo.com/v1/search
//   • Géocodage inversé (coords → ville) : BigDataCloud (client, sans clé)
// Aucun secret n'est exposé dans le bundle — parfait pour une démo publique.
// ────────────────────────────────────────────────────────────────────────────

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

const CURRENT_FIELDS = [
  'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
  'is_day', 'weather_code', 'wind_speed_10m', 'surface_pressure', 'visibility'
].join(',')
const DAILY_FIELDS = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min',
  'precipitation_probability_max', 'sunrise', 'sunset'
].join(',')

const REQUEST_TIMEOUT = 10_000
const CACHE_TTL = 1000 * 60 * 10   // 10 min
const MEMORY_CACHE_LIMIT = 50

// Erreur métier « ville introuvable » (traitée spécifiquement par useWeather).
export class CityNotFoundError extends Error {
  constructor(message = 'City not found') {
    super(message)
    this.name = 'CityNotFoundError'
    this.code = 'CITY_NOT_FOUND'
  }
}

// ── Cache mémoire LRU + sessionStorage ──────────────────────────────────────
const memoryCache = new Map()

function lruTouch(key, value) {
  if (memoryCache.has(key)) memoryCache.delete(key)
  memoryCache.set(key, value)
  if (memoryCache.size > MEMORY_CACHE_LIMIT) {
    memoryCache.delete(memoryCache.keys().next().value)
  }
}

function getFromCache(key, ttl) {
  const mem = memoryCache.get(key)
  if (mem && Date.now() - mem.timestamp < ttl) {
    memoryCache.delete(key)
    memoryCache.set(key, mem)
    return mem.data
  }
  try {
    const stored = sessionStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.timestamp && Date.now() - parsed.timestamp < ttl) {
        lruTouch(key, parsed)
        return parsed.data
      }
      sessionStorage.removeItem(key)
    }
  } catch { /* mode privé → silencieux */ }
  return null
}

function setToCache(key, data) {
  const pack = { timestamp: Date.now(), data }
  lruTouch(key, pack)
  try { sessionStorage.setItem(key, JSON.stringify(pack)) } catch { /* quota → silencieux */ }
}

// ── AbortController centralisé ──────────────────────────────────────────────
let currentController = null

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

function ensureNotAborted(signal) {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
}

async function getJson(url, params, signal) {
  const { data } = await axios.get(url, { params, signal, timeout: REQUEST_TIMEOUT })
  return data
}

// ── Appels bas niveau ───────────────────────────────────────────────────────
async function geocodeCity(city, signal, lang) {
  const data = await getJson(GEOCODE_URL, { name: city, count: 1, language: lang, format: 'json' }, signal)
  const r = data?.results?.[0]
  if (!r) throw new CityNotFoundError()
  return { name: r.name, country: r.country || r.country_code || '', lat: r.latitude, lon: r.longitude }
}

async function reverseGeocode(lat, lon, signal, lang) {
  try {
    const data = await getJson(REVERSE_URL, { latitude: lat, longitude: lon, localityLanguage: lang }, signal)
    return { name: data?.city || data?.locality || '—', country: data?.countryCode || '' }
  } catch {
    return { name: '—', country: '' } // le géocodage inversé est un « nice-to-have »
  }
}

async function fetchForecast(lat, lon, signal, lang) {
  return getJson(FORECAST_URL, {
    latitude: lat, longitude: lon,
    current: CURRENT_FIELDS, daily: DAILY_FIELDS,
    timezone: 'auto', forecast_days: 5, wind_speed_unit: 'kmh', lang
  }, signal)
}

function pack(place, forecast) {
  return {
    place,
    current: forecast.current,
    daily: forecast.daily,
    utcOffsetSeconds: forecast.utc_offset_seconds ?? 0,
    timezone: forecast.timezone || 'UTC'
  }
}

// ── API publique (mêmes points d'entrée que consomme useWeather) ────────────
export async function getWeatherByCity(city, signal, lang = 'fr') {
  if (!city || typeof city !== 'string') throw new CityNotFoundError()
  ensureNotAborted(signal)

  const cacheKey = `city:${city.trim().toLowerCase()}:${lang}`
  const cached = getFromCache(cacheKey, CACHE_TTL)
  if (cached) return cached

  const place = await geocodeCity(city.trim(), signal, lang)
  const forecast = await fetchForecast(place.lat, place.lon, signal, lang)
  const result = pack(place, forecast)
  setToCache(cacheKey, result)
  return result
}

export async function getWeatherByCoords(lat, lon, signal, lang = 'fr') {
  ensureNotAborted(signal)

  const cacheKey = `coords:${lat.toFixed(2)}:${lon.toFixed(2)}:${lang}`
  const cached = getFromCache(cacheKey, CACHE_TTL)
  if (cached) return cached

  const [place, forecast] = await Promise.all([
    reverseGeocode(lat, lon, signal, lang),
    fetchForecast(lat, lon, signal, lang)
  ])
  const result = pack(place, forecast)
  setToCache(cacheKey, result)
  return result
}

// Plus de clé à configurer : toujours prêt.
export function isApiConfigured() {
  return true
}
