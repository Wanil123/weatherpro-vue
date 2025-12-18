<template>
  <div class="weather-icon" :class="sizeClass">
    <component :is="iconComponent" :animated="animated" />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  size: { type: String, default: 'md' }, // sm, md, lg, xl
  animated: { type: Boolean, default: true }
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

const defaultIcon = defineAsyncComponent(() => import('./weather/SunIcon.vue'))

const iconComponent = computed(() => iconComponents[props.code] || defaultIcon)

const sizeClass = computed(() => ({
  'w-8 h-8': props.size === 'sm',
  'w-12 h-12': props.size === 'md',
  'w-16 h-16': props.size === 'lg',
  'w-24 h-24': props.size === 'xl',
  'w-32 h-32': props.size === '2xl'
}))
</script>

<style scoped>
.weather-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
