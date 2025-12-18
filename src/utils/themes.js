export function themeFromCondition(main, isNight = false) {
  if (isNight) return 'Night'
  const known = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm']
  return known.includes(main) ? main : 'Clouds'
}
