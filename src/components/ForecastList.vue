<template>
  <section
    class="forecast-section"
    role="region"
    :aria-label="t('forecastAria')"
  >
    <h3 class="text-xs sm:text-sm font-semibold mb-4 sm:mb-5 flex items-center gap-2 text-white/50 uppercase tracking-wider">
      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {{ t('forecastTitle') }}
    </h3>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
      role="list"
    >
      <TransitionGroup name="forecast">
        <ForecastCard
          v-for="(forecast, index) in items"
          :key="forecast.date"
          :item="forecast"
          :style="{ '--delay': `${index * 80}ms` }"
        />
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup>
import ForecastCard from './ForecastCard.vue'
import { useI18n } from '../i18n/useI18n'

const { t } = useI18n()
defineProps({
  items: { type: Array, default: () => [] }
})
</script>

<style scoped>
.forecast-section {
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.forecast-section:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.forecast-enter-active {
  transition: all 0.4s ease-out;
  transition-delay: var(--delay, 0ms);
}

.forecast-leave-active {
  transition: all 0.3s ease-in;
}

.forecast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.forecast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
