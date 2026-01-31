import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

function toLocal(ts, tzSec) {
  return dayjs.unix(ts).utcOffset(tzSec / 60).format('HH:mm')
}

export function formatCurrent(raw, lang = 'fr') {
  dayjs.locale(lang)
  const tz = raw.timezone || 0
  const isNight = raw.weather?.[0]?.icon?.includes('n')
  return {
    city: raw.name,
    country: raw.sys?.country,
    temperature: raw.main?.temp,
    feelsLike: raw.main?.feels_like,
    description: raw.weather?.[0]?.description,
    icon: raw.weather?.[0]?.icon,
    humidity: raw.main?.humidity,
    windSpeed: (raw.wind?.speed || 0) * 3.6,
    pressure: raw.main?.pressure,
    visibility: Math.round((raw.visibility || 0) / 1000),
    uvIndex: null,
    sunrise: toLocal(raw.sys?.sunrise, tz),
    sunset: toLocal(raw.sys?.sunset, tz),
    date: dayjs.unix(raw.dt).utcOffset(tz / 60).format('dddd D MMM YYYY'),
    localTime: dayjs.unix(raw.dt).utcOffset(tz / 60).format('HH:mm'),
    isNight,
    main: raw.weather?.[0]?.main || 'Clear'
  }
}

export function formatForecastList(raw, lang = 'fr') {
  dayjs.locale(lang)
  const byDay = {}
  for (const it of raw.list || []) {
    const d = it.dt_txt.split(' ')[0]
    byDay[d] = byDay[d] || []
    byDay[d].push(it)
  }
  const days = Object.entries(byDay).slice(0, 5).map(([date, arr]) => {
    const temps = arr.map(x => x.main.temp)
    const min = Math.min(...temps)
    const max = Math.max(...temps)
    const icons = arr.map(x => x.weather?.[0]?.icon)
    const freq = {}
    for (const ic of icons) { freq[ic] = (freq[ic] || 0) + 1 }
    const icon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '01d'
    const desc = arr[Math.floor(arr.length/2)]?.weather?.[0]?.description || ''
    const pop = Math.round(100 * (arr.reduce((s, x) => s + (x.pop || 0), 0) / arr.length))

    const djs = dayjs(date)
    return {
      day: djs.format('dddd'),
      date: djs.format('D MMM'),
      tempMin: min,
      tempMax: max,
      icon,
      description: desc,
      precipitation: pop
    }
  })
  return days
}
