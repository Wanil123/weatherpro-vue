<template>
  <article
    class="forecast-card group"
    role="listitem"
    :aria-label="t('forecastCardAria', { day: item.day, desc: item.description })"
  >
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-[10px] font-medium text-white/35 uppercase tracking-wider">{{ item.date }}</div>
        <div class="text-sm font-bold text-white/90">{{ item.day }}</div>
      </div>
    </div>

    <!-- Icône météo -->
    <div class="flex justify-center my-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
      <WeatherIcon :code="item.icon" size="lg" :title="item.description" />
    </div>

    <!-- Températures -->
    <div class="flex items-center justify-center gap-2 mb-3">
      <span class="text-xl font-bold text-white/90 font-mono">{{ Math.round(item.tempMax) }}°</span>
      <span class="text-sm text-white/20">/</span>
      <span class="text-sm text-white/40 font-mono">{{ Math.round(item.tempMin) }}°</span>
    </div>

    <!-- Temperature gradient bar -->
    <div class="temp-bar-container mb-3">
      <div class="temp-bar" :style="{ width: tempBarWidth + '%' }">
        <div class="temp-bar-glow" />
      </div>
    </div>

    <!-- Précipitations -->
    <div class="flex items-center justify-center gap-1.5 text-xs text-white/40">
      <svg class="w-3.5 h-3.5 text-sky-400/60" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
      <span class="font-mono">{{ item.precipitation ?? 0 }}%</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import WeatherIcon from './icons/WeatherIcon.vue'
import { useI18n } from '../i18n/useI18n'

const { t } = useI18n()
const props = defineProps({
  item: { type: Object, required: true }
})

const tempBarWidth = computed(() => {
  const avg = (props.item.tempMax + props.item.tempMin) / 2
  return Math.max(10, Math.min(100, ((avg + 20) / 65) * 100))
})
</script>

<style scoped>
.forecast-card {
  padding: 1rem;
  border-radius: 0.875rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  animation: card-appear 0.5s ease-out both;
  animation-delay: var(--delay, 0ms);
}

.forecast-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(14, 165, 233, 0.15);
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(14, 165, 233, 0.05);
}

.temp-bar-container {
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.temp-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #0ea5e9, #a78bfa, #f472b6);
  position: relative;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.temp-bar-glow {
  position: absolute;
  inset: 0;
  background: inherit;
  filter: blur(4px);
  opacity: 0.6;
}

@keyframes card-appear {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
