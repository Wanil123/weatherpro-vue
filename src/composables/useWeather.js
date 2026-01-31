import { ref } from 'vue'
import {
  getCurrentByCity, getForecastByCity,
  getCurrentByCoords, getForecastByCoords,
  isApiConfigured, createRequestGroup
} from '../services/weatherApi'
import { formatCurrent, formatForecastList } from '../utils/formatters'
import { useNotificationStore } from '../stores/notifications'
import { useI18n } from '../i18n/useI18n'

export function useWeather() {
  const current = ref(null)
  const forecast = ref([])
  const loading = ref(false)
  const error = ref(null)
  const { t, lang } = useI18n()

  function getNotifications() {
    return useNotificationStore()
  }

  function isAbortError(e) {
    return e.name === 'AbortError' || e.name === 'CanceledError' || e.code === 'ERR_CANCELED'
  }

  async function fetchByCity(city) {
    if (!isApiConfigured()) {
      getNotifications().error(t('apiNotConfigured'), t('notifError'))
      return false
    }

    loading.value = true
    error.value = null
    const signal = createRequestGroup()

    try {
      const [c, f] = await Promise.all([
        getCurrentByCity(city, signal, lang.value),
        getForecastByCity(city, signal, lang.value)
      ])
      current.value = formatCurrent(c, lang.value)
      forecast.value = formatForecastList(f, lang.value)
      return true
    } catch (e) {
      if (isAbortError(e)) return false
      error.value = e.message

      if (e.response?.status === 404) {
        getNotifications().warning(t('cityNotFound'), t('cityNotFoundTitle'))
      } else if (e.response?.status === 401) {
        getNotifications().error(t('apiInvalid'), t('apiInvalidTitle'))
      } else {
        getNotifications().error(t('connectionError'), t('connectionErrorTitle'))
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchByCoords(lat, lon) {
    if (!isApiConfigured()) {
      getNotifications().error(t('apiNotConfigured'), t('notifError'))
      return false
    }

    loading.value = true
    error.value = null
    const signal = createRequestGroup()

    try {
      const [c, f] = await Promise.all([
        getCurrentByCoords(lat, lon, signal, lang.value),
        getForecastByCoords(lat, lon, signal, lang.value)
      ])
      current.value = formatCurrent(c, lang.value)
      forecast.value = formatForecastList(f, lang.value)
      getNotifications().success(
        t('weatherLoaded', { city: current.value.city }),
        t('locationTitle')
      )
      return true
    } catch (e) {
      if (isAbortError(e)) return false
      error.value = e.message
      getNotifications().error(t('geoError'), t('geoErrorTitle'))
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
