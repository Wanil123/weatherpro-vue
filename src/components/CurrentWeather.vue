<template>
  <article
    ref="cardRef"
    class="current-card relative overflow-hidden group"
    :style="tiltStyle"
    role="region"
    :aria-label="t('currentWeatherAria')"
  >
    <div class="absolute inset-0 rounded-2xl border-gradient pointer-events-none" />
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shimmer-overlay rounded-2xl" />

    <div class="relative z-10 flex flex-col gap-4 sm:gap-6">
      <!-- City & Icon -->
      <div class="flex items-start justify-between">
        <div class="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
          <div class="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h2 class="text-lg sm:text-xl font-bold tracking-tight text-white truncate">{{ data.city }}</h2>
            <span class="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider rounded-md flex-shrink-0"
                  style="background: rgba(14, 165, 233, 0.15); color: #7dd3fc; border: 1px solid rgba(14, 165, 233, 0.2);">
              {{ data.country }}
            </span>
            <button
              @click="toggleFavorite"
              class="p-1 rounded-lg hover:bg-white/5 transition-all duration-200 active:scale-90 flex-shrink-0"
              :aria-label="isFavorite ? t('removeFavorite') : t('addFavorite')"
            >
              <svg class="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300"
                :class="isFavorite ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-white/30'"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[13px] text-white/35">
            <span class="capitalize truncate">{{ data.date }}</span>
            <span class="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
            <span class="font-mono text-white/50">{{ data.localTime }}</span>
          </div>
        </div>

        <div class="transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0 ml-2">
          <WeatherIcon :code="data.icon" size="xl" :title="data.description" />
        </div>
      </div>

      <!-- Temperature -->
      <div class="flex items-end gap-2 sm:gap-3">
        <div class="relative">
          <span class="text-5xl sm:text-7xl md:text-[88px] font-black tracking-tighter leading-none font-mono temp-number">
            {{ animatedTemp }}
          </span>
          <span class="absolute -top-1 -right-5 sm:-right-7 text-xl sm:text-2xl font-light text-white/40">°C</span>
        </div>
        <div class="pb-1 sm:pb-3">
          <div class="flex items-center gap-1 sm:gap-1.5">
            <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center" style="background: rgba(255,255,255,0.04);">
              <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="text-[10px] sm:text-xs text-white/40">{{ t('feelsLike') }}</span>
            <span class="text-xs sm:text-sm font-semibold text-white/70 font-mono">{{ animatedFeels }}°</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="h-[2px] w-6 sm:w-8 rounded-full bg-gradient-to-r from-sky-400/50 to-transparent" />
        <p class="text-xs sm:text-sm font-medium capitalize text-white/60 tracking-wide">{{ data.description }}</p>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import WeatherIcon from './icons/WeatherIcon.vue'
import { useFavoritesStore } from '../stores/favorites'
import { useNotificationStore } from '../stores/notifications'
import { useAnimatedNumber } from '../composables/useAnimatedNumber'
import { useTilt } from '../composables/useTilt'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
  data: { type: Object, required: true }
})

const { t } = useI18n()
const favoritesStore = useFavoritesStore()
const notifications = useNotificationStore()
const cardRef = ref(null)
const { tiltStyle } = useTilt(cardRef, { maxTilt: 5, scale: 1.01 })

const tempSource = computed(() => Math.round(props.data.temperature ?? 0))
const feelsSource = computed(() => Math.round(props.data.feelsLike ?? 0))
const animatedTemp = useAnimatedNumber(tempSource)
const animatedFeels = useAnimatedNumber(feelsSource)

const cityWithCountry = computed(() => `${props.data.city}, ${props.data.country}`)
const isFavorite = computed(() => favoritesStore.isFavorite(cityWithCountry.value))

function toggleFavorite() {
  const added = favoritesStore.toggle(cityWithCountry.value)
  const msg = added
    ? t('cityAddedToFavorites', { city: props.data.city })
    : t('cityRemovedFromFavorites', { city: props.data.city })
  notifications[added ? 'success' : 'info'](msg)
}
</script>

<style scoped>
.current-card {
  padding: 1.25rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (min-width: 640px) {
  .current-card { padding: 1.5rem; }
}

.current-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.25),
    0 0 60px rgba(14, 165, 233, 0.04);
}

.temp-number {
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.shimmer-overlay {
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 55%, transparent 60%);
  background-size: 200% 100%;
  animation: shimmer-move 3s ease-in-out infinite;
}

@keyframes shimmer-move {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
