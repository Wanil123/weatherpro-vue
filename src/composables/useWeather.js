import { ref } from 'vue'
import {
  getCurrentByCity, getForecastByCity,
  getCurrentByCoords, getForecastByCoords,
  isApiConfigured, createRequestGroup
} from '../services/weatherApi'
import { formatCurrent, formatForecastList } from '../utils/formatters'
import { useNotificationStore } from '../stores/notifications'
import { useI18n } from '../i18n/useI18n'

function isAbortError(e) {
  return e?.name === 'AbortError'
      || e?.name === 'CanceledError'
      || e?.code === 'ERR_CANCELED'
}

export function useWeather() {
  const current = ref(null)
  const forecast = ref([])
  const loading = ref(false)
  const error = ref(null)
  const { t, lang } = useI18n()

  function notify() { return useNotificationStore() }

  function handleError(e) {
    if (isAbortError(e)) return false
    error.value = e?.message || 'Unknown error'

    const status = e?.response?.status
    if (status === 404) {
      notify().warning(t('cityNotFound'), t('cityNotFoundTitle'))
    } else if (status === 401) {
      notify().error(t('apiInvalid'), t('apiInvalidTitle'))
    } else if (e?.code === 'ECONNABORTED' || e?.message?.includes('timeout')) {
      notify().error(t('connectionError'), t('connectionErrorTitle'))
    } else {
      notify().error(t('connectionError'), t('connectionErrorTitle'))
    }
    return false
  }

  async function fetchByCity(city) {
    if (!isApiConfigured()) {
      notify().error(t('apiNotConfigured'), t('notifError'))
      return false
    }
    if (!city || typeof city !== 'string') return false

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
      return handleError(e)
    } finally {
      loading.value = false
    }
  }

  async function fetchByCoords(lat, lon) {
    if (!isApiConfigured()) {
      notify().error(t('apiNotConfigured'), t('notifError'))
      return false
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false

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
      if (current.value?.city) {
        notify().success(
          t('weatherLoaded', { city: current.value.city }),
          t('locationTitle')
        )
      }
      return true
    } catch (e) {
      if (isAbortError(e)) return false
      error.value = e?.message || 'Unknown error'
      notify().error(t('geoError'), t('geoErrorTitle'))
      return false
    } finally {
      loading.value = false
    }
  }

  function reset() {
    current.value = null
    forecast.value = []
    error.value = null
    loading.value = false
  }

  return { current, forecast, loading, error, fetchByCity, fetchByCoords, reset }
}
