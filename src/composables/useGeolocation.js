import { ref } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import { useI18n } from '../i18n/useI18n'

function isFiniteLatLon(lat, lon) {
  return Number.isFinite(lat) && Number.isFinite(lon)
    && Math.abs(lat) <= 90 && Math.abs(lon) <= 180
}

export function useGeolocation() {
  const loading = ref(false)
  const error = ref(null)

  function getCoords({ silent = false, highAccuracy = false } = {}) {
    const { t } = useI18n()

    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
        if (!silent) {
          useNotificationStore().warning(t('geoNotSupported'), t('geoNotSupportedTitle'))
        }
        error.value = 'Geolocation not available'
        return resolve(null)
      }

      loading.value = true
      error.value = null

      let settled = false
      const finish = (val) => {
        if (settled) return
        settled = true
        loading.value = false
        resolve(val)
      }

      // Filet de sécurité côté Vue (le 10s timeout natif n'est pas toujours fiable sur iOS)
      const fallbackTimer = setTimeout(() => {
        if (!settled) {
          error.value = 'Timeout'
          if (!silent) {
            useNotificationStore().warning(t('geoTimeout'), t('geoTimeoutTitle'))
          }
          finish(null)
        }
      }, 12_000)

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(fallbackTimer)
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          if (!isFiniteLatLon(lat, lon)) {
            error.value = 'Invalid coordinates'
            if (!silent) {
              useNotificationStore().warning(t('geoDefaultError'), t('geoDefaultErrorTitle'))
            }
            return finish(null)
          }
          finish({ lat, lon })
        },
        (err) => {
          clearTimeout(fallbackTimer)
          error.value = err.message

          if (!silent) {
            let message = t('geoDefaultError')
            let title = t('geoDefaultErrorTitle')
            switch (err.code) {
              case err.PERMISSION_DENIED:
                message = t('geoPermissionDenied')
                title = t('geoPermissionDeniedTitle')
                break
              case err.POSITION_UNAVAILABLE:
                message = t('geoPositionUnavailable')
                title = t('geoPositionUnavailableTitle')
                break
              case err.TIMEOUT:
                message = t('geoTimeout')
                title = t('geoTimeoutTitle')
                break
            }
            useNotificationStore().warning(message, title)
          }

          finish(null)
        },
        {
          enableHighAccuracy: !!highAccuracy,
          timeout: 10_000,
          maximumAge: 300_000
        }
      )
    })
  }

  return { getCoords, loading, error }
}
