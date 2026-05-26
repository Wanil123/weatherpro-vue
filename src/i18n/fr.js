export default {
  // App
  appTitle: 'WeatherPro',
  appSubtitle: 'Prévisions en temps réel',
  footerData: 'Données par',
  footerBuilt: 'Conçu avec Vue.js',
  skipToContent: 'Aller au contenu',
  langSwitchAria: 'Passer en {to}',
  langLabel: 'FR',
  degreesCelsius: 'degrés Celsius',
  precipitationProbability: 'probabilité de précipitation',

  // SearchBar
  searchPlaceholder: 'Rechercher une ville (ex. Paris, FR)',
  searchAriaLabel: 'Rechercher une ville',
  searchBtn: 'Rechercher',
  searching: 'Recherche…',
  clearInputAria: 'Effacer la saisie',
  geolocateBtn: 'Ma position',
  geolocateAriaLabel: 'Utiliser ma position',

  // CurrentWeather
  currentWeatherAria: 'Météo actuelle',
  addFavorite: 'Ajouter aux favoris',
  removeFavorite: 'Retirer des favoris',
  feelsLike: 'Ressenti',

  // WeatherDetails
  detailsAria: 'Détails météo',
  detailsTitle: 'Détails',
  humidity: 'Humidité',
  wind: 'Vent',
  pressure: 'Pression',
  visibility: 'Visibilité',
  uvIndex: 'Indice UV',
  sunrise: 'Lever',
  sunset: 'Coucher',

  // ForecastList
  forecastAria: 'Prévisions sur 5 jours',
  forecastTitle: 'Prévisions sur 5 jours',
  forecastCardAria: 'Prévision pour {day} : {desc}',
  noForecast: 'Aucune prévision disponible',

  // FavoritesPanel
  favoritesAria: 'Villes favorites',
  favoritesTitle: 'Favoris',
  clearAll: 'Effacer',
  clearAllFavoritesAria: 'Supprimer tous les favoris',
  viewCityWeather: 'Voir la météo de {city}',
  removeFavoriteAria: 'Retirer ce favori',
  noFavorites: 'Aucune ville favorite',
  favoriteRemovedMsg: '{city} retirée des favoris',
  favoriteRemovedTitle: 'Favoris',
  allFavoritesCleared: 'Tous les favoris ont été supprimés',
  confirmClearAllFavorites: 'Supprimer toutes les villes favorites ? Cette action est irréversible.',

  // SearchHistory
  historyAria: 'Historique de recherche',
  historyTitle: 'Historique',
  clearHistory: 'Effacer',
  clearHistoryAria: "Effacer l'historique de recherche",
  searchCity: 'Rechercher {city}',
  noHistory: 'Aucune recherche récente',
  confirmClearHistory: "Effacer l'historique de recherche ?",

  // WeatherGreeting
  greetingMorning: 'Bonjour, {city}',
  greetingAfternoon: 'Bon après-midi, {city}',
  greetingEvening: 'Bonsoir, {city}',
  greetingNight: 'Bonne nuit, {city}',
  subtitleFreezing: 'Il fait glacial dehors, couvrez-vous bien !',
  subtitleCold: 'Temps frais, un manteau serait idéal.',
  subtitleMild: 'Température agréable pour sortir.',
  subtitleWarm: 'Belle journée en perspective !',
  subtitleHot: 'Chaleur intense, restez hydraté !',
  emojiSun: 'soleil',
  emojiPartlySun: 'partiellement nuageux',
  emojiSunset: 'coucher de soleil',
  emojiMoon: 'lune',

  // ThemeToggle
  themeToggleAria: 'Basculer entre mode clair et sombre',

  // LoadingSpinner
  loadingAria: 'Chargement en cours',
  loadingText: 'Chargement des données météo',
  loadingSubtext: 'Veuillez patienter…',
  loadingSr: 'Chargement en cours, veuillez patienter',

  // ToastNotifications
  closeAria: 'Fermer',

  // Notification titles
  notifSuccess: 'Succès',
  notifError: 'Erreur',
  notifWarning: 'Attention',
  notifInfo: 'Info',

  // useWeather errors
  apiNotConfigured: 'Clé API OpenWeather non configurée. Vérifiez votre fichier .env',
  cityNotFound: 'Ville introuvable. Essayez le format « Ville, CodePays » (ex. Paris, FR)',
  cityNotFoundTitle: 'Ville non trouvée',
  apiInvalid: 'Clé API invalide ou expirée. Vérifiez votre configuration.',
  apiInvalidTitle: "Erreur d'authentification",
  connectionError: 'Impossible de récupérer les données météo. Vérifiez votre connexion.',
  connectionErrorTitle: 'Erreur de connexion',
  weatherLoaded: 'Météo de {city} chargée',
  locationTitle: 'Localisation',
  geoError: 'Impossible de récupérer les données pour votre position.',
  geoErrorTitle: 'Erreur de géolocalisation',

  // useGeolocation errors
  geoNotSupported: 'Votre navigateur ne supporte pas la géolocalisation.',
  geoNotSupportedTitle: 'Non disponible',
  geoDefaultError: 'Impossible de récupérer votre position.',
  geoDefaultErrorTitle: 'Erreur de localisation',
  geoPermissionDenied: "Vous avez refusé l'accès à votre position. Activez la géolocalisation dans les paramètres.",
  geoPermissionDeniedTitle: 'Permission refusée',
  geoPositionUnavailable: 'Position indisponible. Vérifiez que le GPS est activé.',
  geoPositionUnavailableTitle: 'Position indisponible',
  geoTimeout: 'La demande de localisation a expiré. Réessayez.',
  geoTimeoutTitle: 'Délai dépassé',

  // Favorites toggle
  cityAddedToFavorites: '{city} ajoutée aux favoris',
  cityRemovedFromFavorites: '{city} retirée des favoris'
}
