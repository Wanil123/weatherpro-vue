import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { vRipple } from './directives/vRipple'
import './assets/styles.css'

const app = createApp(App)
app.use(createPinia())
app.directive('ripple', vRipple)
app.mount('#app')
