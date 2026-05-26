<template>
  <article
    class="forecast-card group"
    role="listitem"
    :aria-label="t('forecastCardAria', { day: item.day, desc: item.description })"
  >
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-[10px] font-medium text-white/45 uppercase tracking-wider">{{ item.date }}</div>
        <div class="text-sm font-bold text-white/95">{{ item.day }}</div>
      </div>
    </div>

    <!-- Icône météo -->
    <div class="icon-zone flex justify-center my-4">
      <WeatherIcon :code="item.icon" size="lg" :title="item.description" />
    </div>

    <!-- Températures -->
    <div class="flex items-center justify-center gap-2 mb-3">
      <span class="text-xl font-bold text-white/95 font-mono">
        {{ tempMaxRounded }}°<span class="sr-only"> {{ t('degreesCelsius') }}</span>
      </span>
      <span class="text-sm text-white/25" aria-hidden="true">/</span>
      <span class="text-sm text-white/50 font-mono">
        {{ tempMinRounded }}°<span class="sr-only"> {{ t('degreesCelsius') }}</span>
      </span>
    </div>

    <!-- Temperature gradient bar -->
    <div class="temp-bar-container mb-3" aria-hidden="true">
      <div class="temp-bar" :style="{ width: tempBarWidth + '%' }">
        <div class="temp-bar-glow" />
      </div>
    </div>

    <!-- Précipitations -->
    <div class="flex items-center justify-center gap-1.5 text-xs text-white/55">
      <svg class="w-3.5 h-3.5 text-sky-400/70" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
      <span class="font-mono">
        {{ item.precipitation ?? 0 }}%
        <span class="sr-only">{{ t('precipitationProbability') }}</span>
      </span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import WeatherIcon from './icons/WeatherIcon.vue'
import { useI18n } from '../i18n/useI18n'

// Plage de température couverte par la barre (en °C)
const TEMP_RANGE_MIN = -20
const TEMP_RANGE_MAX = 45
const TEMP_RANGE_SIZE = TEMP_RANGE_MAX - TEMP_RANGE_MIN

const { t } = useI18n()
const props = defineProps({
  item: { type: Object, required: true }
})

const tempMaxRounded = computed(() => {
  return typeof props.item.tempMax === 'number' ? Math.round(props.item.tempMax) : '—'
})
const tempMinRounded = computed(() => {
  return typeof props.item.tempMin === 'number' ? Math.round(props.item.tempMin) : '—'
})

const tempBarWidth = computed(() => {
  const max = props.item.tempMax
  const min = props.item.tempMin
  if (typeof max !== 'number' || typeof min !== 'number') return 10
  const avg = (max + min) / 2
  const pct = ((avg - TEMP_RANGE_MIN) / TEMP_RANGE_SIZE) * 100
  return Math.max(10, Math.min(100, pct))
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
  transition: background-color 0.4s ease, border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
}

.forecast-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(14, 165, 233, 0.18);
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(14, 165, 233, 0.08);
}

.icon-zone {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.forecast-card:hover .icon-zone { transform: scale(1.1) rotate(3deg); }

.temp-bar-container {
  height: 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.temp-bar {
  height: 100%;
  border-radius: 3px;
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

@media (prefers-reduced-motion: reduce) {
  .forecast-card { transition: none; }
  .forecast-card:hover { transform: none; }
  .icon-zone { transition: none; }
  .forecast-card:hover .icon-zone { transform: none; }
  .temp-bar { transition: none; }
}
</style>
