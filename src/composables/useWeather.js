import { ref } from 'vue'
import { getCurrentByCity, getForecastByCity, getCurrentByCoords, getForecastByCoords, isApiConfigured } from '../services/weatherApi'
import { formatCurrent, formatForecastList } from '../utils/formatters'
import { useNotificationStore } from '../stores/notifications'

export function useWeather() {
  const current = ref(null)
  const forecast = ref([])
  const loading = ref(false)
  const error = ref(null)

  function getNotifications() {
    // Lazy loading pour éviter les problèmes d'initialisation Pinia
    return useNotificationStore()
  }

  async function fetchByCity(city) {
    if (!isApiConfigured()) {
      getNotifications().error('Clé API OpenWeather non configurée. Vérifiez votre fichier .env')
      return false
    }

    loading.value = true
    error.value = null

    try {
      const [c, f] = await Promise.all([
        getCurrentByCity(city),
        getForecastByCity(city)
      ])
      current.value = formatCurrent(c)
      forecast.value = formatForecastList(f)
      return true
    } catch (e) {
      console.error('Erreur fetchByCity:', e)
      error.value = e.message

      if (e.response?.status === 404) {
        getNotifications().warning(
          'Ville introuvable. Essayez le format "Ville, CodePays" (ex: Paris, FR)',
          'Ville non trouvée'
        )
      } else if (e.response?.status === 401) {
        getNotifications().error(
          'Clé API invalide ou expirée. Vérifiez votre configuration.',
          'Erreur d\'authentification'
        )
      } else {
        getNotifications().error(
          'Impossible de récupérer les données météo. Vérifiez votre connexion.',
          'Erreur de connexion'
        )
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchByCoords(lat, lon) {
    if (!isApiConfigured()) {
      getNotifications().error('Clé API OpenWeather non configurée. Vérifiez votre fichier .env')
      return false
    }

    loading.value = true
    error.value = null

    try {
      const [c, f] = await Promise.all([
        getCurrentByCoords(lat, lon),
        getForecastByCoords(lat, lon)
      ])
      current.value = formatCurrent(c)
      forecast.value = formatForecastList(f)
      getNotifications().success(`Météo de ${current.value.city} chargée`, 'Localisation')
      return true
    } catch (e) {
      console.error('Erreur fetchByCoords:', e)
      error.value = e.message
      getNotifications().error(
        'Impossible de récupérer les données pour votre position.',
        'Erreur de géolocalisation'
      )
      return false
    } finally {
      loading.value = false
    }
  }

  function reset() {
    current.value = null
    forecast.value = []
    error.value = null
  }

  return {
    current,
    forecast,
    loading,
    error,
    fetchByCity,
    fetchByCoords,
    reset
  }
}
