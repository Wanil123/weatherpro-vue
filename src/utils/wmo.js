// Mapping des codes météo WMO (Open-Meteo) → système d'icônes existant (style OpenWeather)
// + condition principale (pour le thème) + description bilingue.
// On garde des codes d'icône "01".."50" pour ne pas toucher à weatherIcons.js / WeatherIcon.vue.

const WMO = Object.freeze({
  0:  { base: '01', main: 'Clear',        fr: 'ciel dégagé',            en: 'clear sky' },
  1:  { base: '02', main: 'Clear',        fr: 'principalement dégagé',  en: 'mainly clear' },
  2:  { base: '03', main: 'Clouds',       fr: 'partiellement nuageux',  en: 'partly cloudy' },
  3:  { base: '04', main: 'Clouds',       fr: 'couvert',                en: 'overcast' },
  45: { base: '50', main: 'Fog',          fr: 'brouillard',             en: 'fog' },
  48: { base: '50', main: 'Fog',          fr: 'brouillard givrant',     en: 'depositing rime fog' },
  51: { base: '09', main: 'Drizzle',      fr: 'bruine légère',          en: 'light drizzle' },
  53: { base: '09', main: 'Drizzle',      fr: 'bruine',                 en: 'drizzle' },
  55: { base: '09', main: 'Drizzle',      fr: 'bruine dense',           en: 'dense drizzle' },
  56: { base: '09', main: 'Drizzle',      fr: 'bruine verglaçante',     en: 'freezing drizzle' },
  57: { base: '09', main: 'Drizzle',      fr: 'bruine verglaçante',     en: 'freezing drizzle' },
  61: { base: '10', main: 'Rain',         fr: 'pluie légère',           en: 'light rain' },
  63: { base: '10', main: 'Rain',         fr: 'pluie',                  en: 'rain' },
  65: { base: '10', main: 'Rain',         fr: 'forte pluie',            en: 'heavy rain' },
  66: { base: '10', main: 'Rain',         fr: 'pluie verglaçante',      en: 'freezing rain' },
  67: { base: '10', main: 'Rain',         fr: 'pluie verglaçante',      en: 'freezing rain' },
  71: { base: '13', main: 'Snow',         fr: 'neige légère',           en: 'light snow' },
  73: { base: '13', main: 'Snow',         fr: 'neige',                  en: 'snow' },
  75: { base: '13', main: 'Snow',         fr: 'forte neige',            en: 'heavy snow' },
  77: { base: '13', main: 'Snow',         fr: 'grains de neige',        en: 'snow grains' },
  80: { base: '09', main: 'Rain',         fr: 'averses légères',        en: 'light showers' },
  81: { base: '09', main: 'Rain',         fr: 'averses',                en: 'showers' },
  82: { base: '09', main: 'Rain',         fr: 'fortes averses',         en: 'heavy showers' },
  85: { base: '13', main: 'Snow',         fr: 'averses de neige',       en: 'snow showers' },
  86: { base: '13', main: 'Snow',         fr: 'fortes averses de neige',en: 'heavy snow showers' },
  95: { base: '11', main: 'Thunderstorm', fr: 'orage',                  en: 'thunderstorm' },
  96: { base: '11', main: 'Thunderstorm', fr: 'orage avec grêle',       en: 'thunderstorm with hail' },
  99: { base: '11', main: 'Thunderstorm', fr: 'violent orage, grêle',   en: 'thunderstorm, heavy hail' }
})

const DEFAULT = { base: '04', main: 'Clouds', fr: 'couvert', en: 'overcast' }

// Retourne { icon: '10n', main, description } à partir d'un code WMO + jour/nuit.
export function decodeWeather(code, isDay = true, lang = 'fr') {
  const e = WMO[code] ?? DEFAULT
  const suffix = isDay ? 'd' : 'n'
  return {
    icon: `${e.base}${suffix}`,
    main: e.main,
    description: lang === 'en' ? e.en : e.fr
  }
}
