import { ref } from 'vue'
import { useNotificationStore } from '../stores/notifications'

export function useGeolocation() {
  const loading = ref(false)
  const error = ref(null)

  function getNotifications() {
    return useNotificationStore()
  }

  function getCoords({ silent = false } = {}) {
    return new Promise(resolve => {
      // Vérifier si la géolocalisation est disponible
      if (!('geolocation' in navigator)) {
        if (!silent) {
          getNotifications().warning(
            'Votre navigateur ne supporte pas la géolocalisation.',
            'Non disponible'
          )
        }
        error.value = 'Géolocalisation non disponible'
        return resolve(null)
      }

      loading.value = true
      error.value = null

      navigator.geolocation.getCurrentPosition(
        // Succès
        pos => {
          loading.value = false
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          })
        },
        // Erreur
        err => {
          loading.value = false
          error.value = err.message

          if (!silent) {
            let message = 'Impossible de récupérer votre position.'
            let title = 'Erreur de localisation'

            switch (err.code) {
              case err.PERMISSION_DENIED:
                message = 'Vous avez refusé l\'accès à votre position. Activez la géolocalisation dans les paramètres.'
                title = 'Permission refusée'
                break
              case err.POSITION_UNAVAILABLE:
                message = 'Position indisponible. Vérifiez que le GPS est activé.'
                title = 'Position indisponible'
                break
              case err.TIMEOUT:
                message = 'La demande de localisation a expiré. Réessayez.'
                title = 'Délai dépassé'
                break
            }

            getNotifications().warning(message, title)
          }

          resolve(null)
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // Cache la position pendant 5 minutes
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
