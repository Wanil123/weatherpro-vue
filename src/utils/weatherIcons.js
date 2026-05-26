// Mapping OpenWeather icon code → emoji (fallback léger universel)
// Icônes jour/nuit différenciées correctement.
const MAP = Object.freeze({
  '01d': '☀️',  '01n': '🌙',
  '02d': '🌤️', '02n': '☁️',
  '03d': '⛅',  '03n': '☁️',
  '04d': '☁️',  '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️',  '11n': '⛈️',
  '13d': '❄️',  '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️'
})

const FALLBACK = '☁️'

export function iconToEmoji(code) {
  if (!code) return FALLBACK
  return MAP[String(code).trim().toLowerCase()] || FALLBACK
}
