<template>
  <section
    class="card glass"
    role="region"
    aria-label="Prévisions sur 5 jours"
  >
    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Prévisions (5 jours)
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
          :style="{ '--delay': `${index * 100}ms` }"
        />
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup>
import ForecastCard from './ForecastCard.vue'

defineProps({
  items: { type: Array, default: () => [] }
})
</script>

<style scoped>
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
