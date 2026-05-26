import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { vRipple } from './directives/vRipple'
import './assets/styles.css'

const app = createApp(App)

// Error handlers globaux : évite les exceptions silencieuses en prod
app.config.errorHandler = (err, instance, info) => {
  // eslint-disable-next-line no-console
  console.error('[WeatherPro] Vue error:', err, '\nInfo:', info)
}

if (import.meta.env.DEV) {
  app.config.performance = true
}

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // eslint-disable-next-line no-console
    console.error('[WeatherPro] Unhandled promise rejection:', event.reason)
  })
}

app.use(createPinia())
app.directive('ripple', vRipple)
app.mount('#app')
