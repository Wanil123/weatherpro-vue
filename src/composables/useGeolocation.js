import { ref } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import { useI18n } from '../i18n/useI18n'

export function useGeolocation() {
  const loading = ref(false)
  const error = ref(null)

  function getNotifications() {
    return useNotificationStore()
  }

  function getCoords({ silent = false } = {}) {
    const { t } = useI18n()

    return new Promise(resolve => {
      if (!('geolocation' in navigator)) {
        if (!silent) {
          getNotifications().warning(t('geoNotSupported'), t('geoNotSupportedTitle'))
        }
        error.value = 'Geolocation not available'
        return resolve(null)
      }

      loading.value = true
      error.value = null

      navigator.geolocation.getCurrentPosition(
        pos => {
          loading.value = false
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          })
        },
        err => {
          loading.value = false
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

            getNotifications().warning(message, title)
          }

          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    })
  }

  return {
    getCoords,
    loading,
    error
  }
}
