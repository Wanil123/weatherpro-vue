// Mapping de la condition OpenWeather → thème visuel.
// Plus exhaustif que la version précédente (gère Mist/Fog/Drizzle/Tornado…)
const THEME_MAP = {
  Clear: 'Clear',
  Clouds: 'Clouds',
  Rain: 'Rain',
  Drizzle: 'Rain',
  Snow: 'Snow',
  Thunderstorm: 'Thunderstorm',
  Mist: 'Fog',
  Smoke: 'Fog',
  Haze: 'Fog',
  Dust: 'Fog',
  Fog: 'Fog',
  Sand: 'Fog',
  Ash: 'Fog',
  Squall: 'Thunderstorm',
  Tornado: 'Thunderstorm'
}

export const VALID_THEMES = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Night', 'Fog']

export function themeFromCondition(main, isNight = false) {
  if (isNight) return 'Night'
  return THEME_MAP[main] || 'Clouds'
}
