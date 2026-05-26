import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// Formats heure dépendants de la langue (12h pour EN, 24h pour FR)
function timeFormat(lang) {
  return lang === 'en' ? 'h:mm A' : 'HH:mm'
}

function dateFormat(lang) {
  return lang === 'en' ? 'dddd MMM D, YYYY' : 'dddd D MMM YYYY'
}

function toLocalTime(ts, tzSec, lang = 'fr') {
  if (typeof ts !== 'number') return '—'
  return dayjs.unix(ts).utcOffset(tzSec / 60).locale(lang).format(timeFormat(lang))
}

export function formatCurrent(raw, lang = 'fr') {
  if (!raw || typeof raw !== 'object') {
    throw new Error('formatCurrent: invalid raw response')
  }
  const tz = raw.timezone || 0
  const iconCode = raw.weather?.[0]?.icon || '01d'
  // `endsWith('n')` est plus précis que `includes('n')` (évite faux positifs sur futurs codes)
  const isNight = iconCode.endsWith('n')

  return {
    city: raw.name || '—',
    country: raw.sys?.country || '',
    temperature: typeof raw.main?.temp === 'number' ? raw.main.temp : null,
    feelsLike: typeof raw.main?.feels_like === 'number' ? raw.main.feels_like : null,
    description: raw.weather?.[0]?.description || '',
    icon: iconCode,
    humidity: typeof raw.main?.humidity === 'number' ? raw.main.humidity : null,
    windSpeed: typeof raw.wind?.speed === 'number' ? raw.wind.speed * 3.6 : 0,
    pressure: typeof raw.main?.pressure === 'number' ? raw.main.pressure : null,
    visibility: typeof raw.visibility === 'number'
      ? Number((raw.visibility / 1000).toFixed(1))
      : null,
    // uvIndex non disponible depuis /weather — retiré du payload (l'affichage affichera '—')
    sunrise: toLocalTime(raw.sys?.sunrise, tz, lang),
    sunset: toLocalTime(raw.sys?.sunset, tz, lang),
    date: typeof raw.dt === 'number'
      ? dayjs.unix(raw.dt).utcOffset(tz / 60).locale(lang).format(dateFormat(lang))
      : '',
    localTime: typeof raw.dt === 'number'
      ? dayjs.unix(raw.dt).utcOffset(tz / 60).locale(lang).format(timeFormat(lang))
      : '',
    isNight,
    main: raw.weather?.[0]?.main || 'Clear'
  }
}

export function formatForecastList(raw, lang = 'fr') {
  if (!raw || !Array.isArray(raw.list)) return []

  const byDay = new Map()
  for (const it of raw.list) {
    if (!it?.dt_txt) continue
    const d = it.dt_txt.split(' ')[0]
    if (!byDay.has(d)) byDay.set(d, [])
    byDay.get(d).push(it)
  }

  const entries = Array.from(byDay.entries()).slice(0, 5)
  return entries.map(([date, arr]) => {
    if (!arr.length) return null

    const temps = arr.map(x => x.main?.temp).filter(t => typeof t === 'number')
    const min = temps.length ? Math.min(...temps) : null
    const max = temps.length ? Math.max(...temps) : null

    // Icon le plus fréquent
    const freq = new Map()
    for (const it of arr) {
      const ic = it.weather?.[0]?.icon
      if (ic) freq.set(ic, (freq.get(ic) || 0) + 1)
    }
    const icon = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '01d'

    // Description : on prend celle de l'icon le plus fréquent pour cohérence
    const matching = arr.find(x => x.weather?.[0]?.icon === icon)
    const desc = matching?.weather?.[0]?.description || arr[Math.floor(arr.length / 2)]?.weather?.[0]?.description || ''

    const pops = arr.map(x => x.pop).filter(p => typeof p === 'number')
    const pop = pops.length
      ? Math.round(100 * (pops.reduce((s, x) => s + x, 0) / pops.length))
      : 0

    const djs = dayjs(date).locale(lang)
    return {
      day: djs.format('dddd'),
      date: djs.format('D MMM'),
      tempMin: min,
      tempMax: max,
      icon,
      description: desc,
      precipitation: pop
    }
  }).filter(Boolean)
}
