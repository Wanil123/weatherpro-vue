<template>
  <div class="weather-icon" :class="sizeClass" :role="title ? 'img' : 'presentation'" :aria-label="title || undefined" :aria-hidden="title ? null : 'true'">
    <component :is="iconComponent" :animated="effectivelyAnimated" :title="title" />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  code: { type: String, default: '01d' },
  size: { type: String, default: 'md' }, // sm, md, lg, xl, 2xl
  animated: { type: Boolean, default: true },
  title: { type: String, default: '' }
})

// Import dynamique des icônes
const iconComponents = {
  '01d': defineAsyncComponent(() => import('./weather/SunIcon.vue')),
  '01n': defineAsyncComponent(() => import('./weather/MoonIcon.vue')),
  '02d': defineAsyncComponent(() => import('./weather/PartlyCloudyIcon.vue')),
  '02n': defineAsyncComponent(() => import('./weather/PartlyCloudyNightIcon.vue')),
  '03d': defineAsyncComponent(() => import('./weather/CloudyIcon.vue')),
  '03n': defineAsyncComponent(() => import('./weather/CloudyIcon.vue')),
  '04d': defineAsyncComponent(() => import('./weather/OvercastIcon.vue')),
  '04n': defineAsyncComponent(() => import('./weather/OvercastIcon.vue')),
  '09d': defineAsyncComponent(() => import('./weather/DrizzleIcon.vue')),
  '09n': defineAsyncComponent(() => import('./weather/DrizzleIcon.vue')),
  '10d': defineAsyncComponent(() => import('./weather/RainIcon.vue')),
  '10n': defineAsyncComponent(() => import('./weather/RainIcon.vue')),
  '11d': defineAsyncComponent(() => import('./weather/ThunderstormIcon.vue')),
  '11n': defineAsyncComponent(() => import('./weather/ThunderstormIcon.vue')),
  '13d': defineAsyncComponent(() => import('./weather/SnowIcon.vue')),
  '13n': defineAsyncComponent(() => import('./weather/SnowIcon.vue')),
  '50d': defineAsyncComponent(() => import('./weather/FogIcon.vue')),
  '50n': defineAsyncComponent(() => import('./weather/FogIcon.vue'))
}

// Fallback neutre : nuage couvert (plus universel qu'un soleil qui ment sur la météo)
const defaultIcon = defineAsyncComponent(() => import('./weather/CloudyIcon.vue'))

const iconComponent = computed(() => {
  const code = (props.code || '').toString().trim().toLowerCase()
  const found = iconComponents[code]
  if (!found && import.meta.env.DEV && code) {
    // eslint-disable-next-line no-console
    console.warn(`[WeatherIcon] Code "${props.code}" inconnu, fallback utilisé.`)
  }
  return found || defaultIcon
})

const sizeClass = computed(() => ({
  'w-8 h-8': props.size === 'sm',
  'w-12 h-12': props.size === 'md',
  'w-16 h-16': props.size === 'lg',
  'w-24 h-24': props.size === 'xl',
  'w-32 h-32': props.size === '2xl'
}))

// Respect prefers-reduced-motion : désactive les animations SVG en interne
const reduceMotion = ref(false)
let mql = null
function sync(e) { reduceMotion.value = e.matches }
onMounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotion.value = mql.matches
    if (mql.addEventListener) mql.addEventListener('change', sync)
    else if (mql.addListener) mql.addListener(sync)
  }
})
onBeforeUnmount(() => {
  if (mql) {
    if (mql.removeEventListener) mql.removeEventListener('change', sync)
    else if (mql.removeListener) mql.removeListener(sync)
  }
})

const effectivelyAnimated = computed(() => props.animated && !reduceMotion.value)
</script>

<style scoped>
.weather-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
