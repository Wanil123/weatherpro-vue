<template>
  <section
    class="forecast-section"
    role="region"
    :aria-label="t('forecastAria')"
  >
    <h3 class="text-xs sm:text-sm font-semibold mb-4 sm:mb-5 flex items-center gap-2 text-white/60 uppercase tracking-wider">
      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {{ t('forecastTitle') }}
    </h3>

    <!-- État vide -->
    <p v-if="!items.length" class="text-xs text-white/40 py-2">{{ t('noForecast') }}</p>

    <TransitionGroup
      v-else
      name="forecast"
      tag="div"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      role="list"
    >
      <ForecastCard
        v-for="(forecast, index) in items"
        :key="forecast.date || forecast.day || index"
        :item="forecast"
        :style="{ '--delay': `${index * 80}ms` }"
      />
    </TransitionGroup>
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
  transition: background-color 0.4s ease, border-color 0.4s ease;
}

.forecast-section:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.forecast-enter-active {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  transition-delay: var(--delay, 0ms);
}

.forecast-leave-active {
  transition: opacity 0.3s ease-in, transform 0.3s ease-in;
}

.forecast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.forecast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .forecast-enter-active,
  .forecast-leave-active { transition: opacity 0.2s ease; }
  .forecast-enter-from, .forecast-leave-to { transform: none; }
  .forecast-section { transition: none; }
}
</style>
