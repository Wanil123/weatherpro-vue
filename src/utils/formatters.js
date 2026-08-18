import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import { decodeWeather } from './wmo'

// Formats dépendants de la langue (12 h pour EN, 24 h pour FR)
function timeFormat(lang) { return lang === 'en' ? 'h:mm A' : 'HH:mm' }
function dateFormat(lang) { return lang === 'en' ? 'dddd MMM D, YYYY' : 'dddd D MMM YYYY' }

// Les timestamps Open-Meteo (timezone=auto) sont déjà à l'heure LOCALE du lieu,
// sans décalage → on parse en naïf et les chiffres d'horloge sont préservés
// quelle que soit la timezone du navigateur.
function fmtLocalTime(isoLocal, lang) {
  if (!isoLocal) return '—'
  const d = dayjs(isoLocal)
  return d.isValid() ? d.locale(lang).format(timeFormat(lang)) : '—'
}

function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : null }

export function formatCurrent(raw, lang = 'fr') {
  if (!raw || typeof raw !== 'object' || !raw.current) {
    throw new Error('formatCurrent: invalid raw response')
  }
  const c = raw.current
  const isDay = c.is_day === 1 || c.is_day === true
  const { icon, main, description } = decodeWeather(c.weather_code, isDay, lang)
  const day0 = raw.daily || {}

  const dateObj = c.time ? dayjs(c.time).locale(lang) : null

  return {
    city: raw.place?.name || '—',
    country: raw.place?.country || '',
    temperature: num(c.temperature_2m),
    feelsLike: num(c.apparent_temperature),
    description,
    icon,
    humidity: num(c.relative_humidity_2m),
    windSpeed: num(c.wind_speed_10m) ?? 0,       // déjà en km/h (wind_speed_unit=kmh)
    pressure: num(c.surface_pressure),
    visibility: num(c.visibility) != null
      ? Number((c.visibility / 1000).toFixed(1))  // m → km
      : null,
    sunrise: fmtLocalTime(day0.sunrise?.[0], lang),
    sunset: fmtLocalTime(day0.sunset?.[0], lang),
    date: dateObj?.isValid() ? dateObj.format(dateFormat(lang)) : '',
    localTime: dateObj?.isValid() ? dateObj.format(timeFormat(lang)) : '',
    isNight: !isDay,
    main
  }
}

export function formatForecastList(raw, lang = 'fr') {
  const d = raw?.daily
  if (!d || !Array.isArray(d.time)) return []

  const out = []
  for (let i = 0; i < d.time.length && i < 5; i++) {
    const djs = dayjs(d.time[i]).locale(lang)
    if (!djs.isValid()) continue
    const { icon, description } = decodeWeather(d.weather_code?.[i], true, lang) // icône de jour
    out.push({
      day: djs.format('dddd'),
      date: djs.format('D MMM'),
      tempMin: num(d.temperature_2m_min?.[i]),
      tempMax: num(d.temperature_2m_max?.[i]),
      icon,
      description,
      precipitation: num(d.precipitation_probability_max?.[i]) ?? 0
    })
  }
  return out
}
