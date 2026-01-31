export default {
  // App
  appTitle: 'WeatherPro',
  appSubtitle: 'Real-time forecasts',
  footerData: 'Data by',
  footerBuilt: 'Built with Vue.js',

  // SearchBar
  searchPlaceholder: 'Search a city (e.g. Paris, FR)',
  searchAriaLabel: 'Search a city',
  searchBtn: 'Search',
  geolocateBtn: 'My location',
  geolocateAriaLabel: 'Use my location',

  // CurrentWeather
  currentWeatherAria: 'Current weather',
  addFavorite: 'Add to favorites',
  removeFavorite: 'Remove from favorites',
  feelsLike: 'Feels like',

  // WeatherDetails
  detailsAria: 'Weather details',
  detailsTitle: 'Details',
  humidity: 'Humidity',
  wind: 'Wind',
  pressure: 'Pressure',
  visibility: 'Visibility',
  uvIndex: 'UV Index',
  sunrise: 'Sunrise',
  sunset: 'Sunset',

  // ForecastList
  forecastAria: '5-day forecast',
  forecastTitle: 'Forecast (5 days)',
  forecastCardAria: 'Forecast for {day}: {desc}',

  // FavoritesPanel
  favoritesAria: 'Favorite cities',
  favoritesTitle: 'Favorites',
  clearAll: 'Clear',
  clearAllFavoritesAria: 'Remove all favorites',
  viewCityWeather: 'View weather for {city}',
  removeFavoriteAria: 'Remove from favorites',
  noFavorites: 'No favorite cities',
  favoriteRemoved: 'Favorite removed',
  allFavoritesCleared: 'All favorites have been cleared',

  // SearchHistory
  historyAria: 'Search history',
  historyTitle: 'History',
  clearHistory: 'Clear',
  clearHistoryAria: 'Clear search history',
  searchCity: 'Search {city}',
  noHistory: 'No recent searches',

  // WeatherGreeting
  greetingMorning: 'Good morning, {city}',
  greetingAfternoon: 'Good afternoon, {city}',
  greetingEvening: 'Good evening, {city}',
  greetingNight: 'Good night, {city}',
  subtitleFreezing: "It's freezing outside, bundle up!",
  subtitleCold: 'Cool weather, a coat would be ideal.',
  subtitleMild: 'Pleasant temperature to go out.',
  subtitleWarm: 'Beautiful day ahead!',
  subtitleHot: 'Intense heat, stay hydrated!',

  // ThemeToggle
  themeToggleAria: 'Toggle light and dark mode',

  // LoadingSpinner
  loadingAria: 'Loading',
  loadingText: 'Loading weather data',
  loadingSubtext: 'Please wait...',
  loadingSr: 'Loading, please wait',

  // ToastNotifications
  closeAria: 'Close',

  // Notification titles
  notifSuccess: 'Success',
  notifError: 'Error',
  notifWarning: 'Warning',
  notifInfo: 'Info',

  // useWeather errors
  apiNotConfigured: 'OpenWeather API key not configured. Check your .env file',
  cityNotFound: 'City not found. Try the format "City, CountryCode" (e.g. Paris, FR)',
  cityNotFoundTitle: 'City not found',
  apiInvalid: 'Invalid or expired API key. Check your configuration.',
  apiInvalidTitle: 'Authentication error',
  connectionError: 'Unable to fetch weather data. Check your connection.',
  connectionErrorTitle: 'Connection error',
  weatherLoaded: 'Weather for {city} loaded',
  locationTitle: 'Location',
  geoError: 'Unable to fetch data for your location.',
  geoErrorTitle: 'Geolocation error',

  // useGeolocation errors
  geoNotSupported: 'Your browser does not support geolocation.',
  geoNotSupportedTitle: 'Not available',
  geoDefaultError: 'Unable to retrieve your position.',
  geoDefaultErrorTitle: 'Location error',
  geoPermissionDenied: 'You denied access to your location. Enable geolocation in your settings.',
  geoPermissionDeniedTitle: 'Permission denied',
  geoPositionUnavailable: 'Position unavailable. Make sure GPS is enabled.',
  geoPositionUnavailableTitle: 'Position unavailable',
  geoTimeout: 'Location request timed out. Try again.',
  geoTimeoutTitle: 'Timeout',

  // Favorites toggle
  cityAddedToFavorites: '{city} added to favorites',
  cityRemovedFromFavorites: '{city} removed from favorites',

  // Language
  langLabel: 'EN',
}
