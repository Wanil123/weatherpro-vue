<template>
  <article
    class="card glass"
    role="region"
    aria-label="Détails météo"
  >
    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      Détails
    </h3>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="detail in details"
        :key="detail.label"
        class="detail-card group"
      >
        <div class="flex items-center gap-2 mb-2">
          <div class="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors flex-shrink-0">
            <component :is="detail.icon" class="w-4 h-4 text-white/80" />
          </div>
          <span class="text-[10px] font-medium text-white/60 uppercase tracking-wide truncate">{{ detail.label }}</span>
        </div>
        <div class="text-xl font-bold">{{ detail.value }}</div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  data: { type: Object, required: true }
})

// Icônes SVG comme composants
const icons = {
  humidity: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707' })
    ])
  },
  wind: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M14 5a2 2 0 012 2M14 5H4m10 0a2 2 0 100 4H4m14 4a2 2 0 11-2 2H4m14-6a2 2 0 100-4' })
    ])
  },
  pressure: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
    ])
  },
  visibility: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })
    ])
  },
  uv: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' })
    ])
  },
  sunrise: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' })
    ])
  },
  sunset: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' })
    ])
  }
}

const details = computed(() => [
  {
    label: 'Humidité',
    value: `${props.data.humidity ?? '—'}%`,
    icon: icons.humidity
  },
  {
    label: 'Vent',
    value: `${Math.round(props.data.windSpeed ?? 0)} km/h`,
    icon: icons.wind
  },
  {
    label: 'Pression',
    value: `${props.data.pressure ?? '—'} hPa`,
    icon: icons.pressure
  },
  {
    label: 'Visibilité',
    value: `${props.data.visibility ?? '—'} km`,
    icon: icons.visibility
  },
  {
    label: 'Index UV',
    value: props.data.uvIndex ?? '—',
    icon: icons.uv
  },
  {
    label: 'Lever',
    value: props.data.sunrise ?? '—',
    icon: icons.sunrise
  },
  {
    label: 'Coucher',
    value: props.data.sunset ?? '—',
    icon: icons.sunset
  }
])
</script>

<style scoped>
.detail-card {
  @apply p-4 rounded-2xl transition-all duration-300;
  @apply border border-white/10 hover:border-white/20;
  @apply transform hover:scale-[1.02];
  @apply overflow-hidden;
  background: rgba(51, 65, 85, 0.9);
}

.detail-card:hover {
  background: rgba(71, 85, 105, 0.95);
}
</style>
