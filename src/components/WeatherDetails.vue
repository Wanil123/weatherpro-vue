<template>
  <article
    ref="detailsRef"
    class="details-card"
    :style="tiltStyle"
    role="region"
    :aria-label="t('detailsAria')"
  >
    <h3 class="text-xs sm:text-sm font-semibold mb-4 sm:mb-5 flex items-center gap-2 text-white/50 uppercase tracking-wider">
      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      {{ t('detailsTitle') }}
    </h3>

    <dl class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
      <div
        v-for="(detail, index) in details"
        :key="detail.key"
        class="detail-item group"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
               :style="`background: ${detail.color}15; border: 1px solid ${detail.color}20;`">
            <component :is="detail.icon" class="w-3 h-3 sm:w-3.5 sm:h-3.5" :style="`color: ${detail.color}`" aria-hidden="true" />
          </div>
          <dt class="text-[10px] sm:text-[11px] font-medium text-white/50 uppercase tracking-wider truncate">{{ detail.label }}</dt>
        </div>
        <dd class="text-base sm:text-lg font-bold text-white/90 font-mono">{{ detail.value }}</dd>
      </div>
    </dl>
  </article>
</template>

<script setup>
import { computed, h, markRaw, ref } from 'vue'
import { useTilt } from '../composables/useTilt'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
  data: { type: Object, required: true }
})

const { t } = useI18n()
const detailsRef = ref(null)
const { tiltStyle } = useTilt(detailsRef, { maxTilt: 4, scale: 1.005 })

// Icônes en markRaw pour éviter qu'elles deviennent réactives (perf + bug fix)
const icons = {
  humidity: markRaw({
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 3l5 8.5a6 6 0 11-10 0L12 3z' })
    ])
  }),
  wind: markRaw({
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M14 5a2 2 0 012 2M14 5H4m10 0a2 2 0 100 4H4m14 4a2 2 0 11-2 2H4m14-6a2 2 0 100-4' })
    ])
  }),
  pressure: markRaw({
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '9', 'stroke-linecap': 'round' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 12l4-4' }),
      h('circle', { cx: '12', cy: '12', r: '1.2', fill: 'currentColor', stroke: 'none' })
    ])
  }),
  visibility: markRaw({
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })
    ])
  }),
  uv: markRaw({
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '4' }),
      h('path', { 'stroke-linecap': 'round', d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' })
    ])
  }),
  sunrise: markRaw({
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 18h18M5 18a7 7 0 0114 0M12 2v3M4.22 5.22l2.12 2.12M19.78 5.22l-2.12 2.12M8 14l4-4 4 4' })
    ])
  }),
  sunset: markRaw({
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 18h18M5 18a7 7 0 0114 0M12 10v-5M4.22 5.22l2.12 2.12M19.78 5.22l-2.12 2.12M8 5l4 4 4-4' })
    ])
  })
}

// IMPORTANT : `key` est stable (non traduit) pour éviter de re-jouer les animations
// quand l'utilisateur change la langue. `label` reste traduit pour l'affichage.
const details = computed(() => [
  { key: 'humidity',   label: t('humidity'),   value: `${props.data.humidity ?? '—'}%`, icon: icons.humidity, color: '#06b6d4' },
  { key: 'wind',       label: t('wind'),       value: `${Math.round(props.data.windSpeed ?? 0)} km/h`, icon: icons.wind, color: '#8b5cf6' },
  { key: 'pressure',   label: t('pressure'),   value: `${props.data.pressure ?? '—'} hPa`, icon: icons.pressure, color: '#f59e0b' },
  { key: 'visibility', label: t('visibility'), value: props.data.visibility != null ? `${props.data.visibility} km` : '—', icon: icons.visibility, color: '#10b981' },
  { key: 'uvIndex',    label: t('uvIndex'),    value: props.data.uvIndex ?? '—', icon: icons.uv, color: '#ef4444' },
  { key: 'sunrise',    label: t('sunrise'),    value: props.data.sunrise ?? '—', icon: icons.sunrise, color: '#f97316' },
  { key: 'sunset',     label: t('sunset'),     value: props.data.sunset ?? '—', icon: icons.sunset, color: '#6366f1' }
])
</script>

<style scoped>
.details-card {
  padding: 1.25rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  will-change: transform;
}

@media (min-width: 640px) {
  .details-card { padding: 1.5rem; }
}

.details-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.detail-item {
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
  animation: detail-appear 0.4s ease-out both;
}

@media (min-width: 640px) {
  .detail-item { padding: 0.875rem; }
}

.detail-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

@keyframes detail-appear {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .detail-item { animation: none; }
  .detail-item:hover { transform: none; }
}
</style>
