<template>
  <article
    class="forecast-card group"
    role="listitem"
    :aria-label="`Prévision pour ${item.day}: ${item.description}`"
  >
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-xs font-medium text-white/60 uppercase tracking-wider">{{ item.date }}</div>
        <div class="text-base font-bold capitalize">{{ item.day }}</div>
      </div>
    </div>

    <!-- Icône météo -->
    <div class="flex justify-center my-4 transform group-hover:scale-110 transition-transform duration-300">
      <WeatherIcon :code="item.icon" size="lg" :title="item.description" />
    </div>

    <!-- Températures -->
    <div class="flex items-center justify-center gap-2 mb-2">
      <span class="text-2xl font-bold">{{ Math.round(item.tempMax) }}°</span>
      <span class="text-lg text-white/50">/</span>
      <span class="text-lg text-white/60">{{ Math.round(item.tempMin) }}°</span>
    </div>

    <!-- Précipitations -->
    <div class="flex items-center justify-center gap-1.5 text-sm text-white/70">
      <svg class="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
      <span>{{ item.precipitation ?? 0 }}%</span>
    </div>
  </article>
</template>

<script setup>
import WeatherIcon from './icons/WeatherIcon.vue'

defineProps({
  item: { type: Object, required: true }
})
</script>

<style scoped>
.forecast-card {
  @apply p-4 rounded-2xl
         bg-white/10 dark:bg-white/5
         border border-white/10
         hover:bg-white/20 dark:hover:bg-white/10
         hover:border-white/20
         backdrop-blur-sm
         transform hover:scale-[1.03] hover:-translate-y-1
         transition-all duration-300 ease-out;
}
</style>
