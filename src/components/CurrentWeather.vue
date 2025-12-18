<template>
  <article
    class="card glass relative overflow-hidden group"
    role="region"
    aria-label="Météo actuelle"
  >
    <!-- Gradient overlay animé -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div class="relative z-10 flex flex-col gap-5">
      <!-- Header: Ville et icône -->
      <div class="flex items-start justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-bold tracking-tight">{{ data.city }}</h2>
            <span class="px-2 py-0.5 text-xs font-medium bg-white/20 dark:bg-white/10 rounded-full">
              {{ data.country }}
            </span>
            <!-- Bouton favori -->
            <button
              @click="toggleFavorite"
              class="p-1.5 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-110"
              :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
              :aria-pressed="isFavorite"
            >
              <svg
                class="w-5 h-5 transition-colors duration-200"
                :class="isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/60'"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-white/70 dark:text-white/60 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="capitalize">{{ data.date }}</span>
            <span class="text-white/40">•</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ data.localTime }}</span>
          </p>
        </div>

        <!-- Icône météo animée -->
        <div class="transform transition-transform duration-300 group-hover:scale-110">
          <WeatherIcon :code="data.icon" size="xl" :title="data.description" />
        </div>
      </div>

      <!-- Température principale -->
      <div class="flex items-end gap-4">
        <div class="relative">
          <span class="text-7xl md:text-8xl font-black tracking-tighter leading-none tabular-nums">
            {{ Math.round(data.temperature) }}
          </span>
          <span class="absolute -top-1 -right-6 text-3xl font-light text-white/80">°C</span>
        </div>
        <div class="pb-3 space-y-1">
          <div class="flex items-center gap-1.5 text-white/70">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-sm">Ressenti</span>
            <span class="font-semibold text-white">{{ Math.round(data.feelsLike) }}°</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="flex items-center gap-3">
        <div class="h-1 w-12 rounded-full bg-gradient-to-r from-white/60 to-transparent" />
        <p class="text-lg font-medium capitalize tracking-wide">{{ data.description }}</p>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import WeatherIcon from './icons/WeatherIcon.vue'
import { useFavoritesStore } from '../stores/favorites'
import { useNotificationStore } from '../stores/notifications'

const props = defineProps({
  data: { type: Object, required: true }
})

const favoritesStore = useFavoritesStore()
const notifications = useNotificationStore()

const cityWithCountry = computed(() => `${props.data.city}, ${props.data.country}`)
const isFavorite = computed(() => favoritesStore.isFavorite(cityWithCountry.value))

function toggleFavorite() {
  const added = favoritesStore.toggle(cityWithCountry.value)
  if (added) {
    notifications.success(`${props.data.city} ajoutée aux favoris`)
  } else {
    notifications.info(`${props.data.city} retirée des favoris`)
  }
}
</script>
