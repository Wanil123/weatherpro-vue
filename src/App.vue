<template>
  <!-- Fond animé dynamique -->
  <WeatherBackground :theme="themeKey" />

  <!-- Notifications Toast -->
  <ToastNotifications />

  <main class="min-h-screen relative z-10">
    <div class="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <!-- Header -->
      <header class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <!-- Logo animé -->
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              WeatherPro
            </h1>
            <p class="text-xs text-white/50 hidden sm:block">Météo en temps réel</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <ThemeToggle v-model="dark" @update:model-value="toggleTheme" />
        </div>
      </header>

      <!-- Contenu principal -->
      <div class="space-y-6">
        <!-- Barre de recherche -->
        <SearchBar
          :loading="loading"
          @search="handleSearch"
          @geolocate="searchCurrentLocation"
        />

        <!-- Skeleton loaders pendant le chargement initial -->
        <template v-if="loading && !current">
          <div class="grid md:grid-cols-2 gap-4 md:gap-6">
            <SkeletonLoader type="current" />
            <SkeletonLoader type="details" />
          </div>
          <SkeletonLoader type="forecast" />
        </template>

        <!-- Contenu météo -->
        <template v-else>
          <Transition name="slide-fade" mode="out-in">
            <div v-if="current" class="grid md:grid-cols-2 gap-4 md:gap-6">
              <CurrentWeather :data="current" />
              <WeatherDetails :data="current" />
            </div>
          </Transition>

          <Transition name="slide-fade" mode="out-in">
            <ForecastList v-if="forecast.length" :items="forecast" />
          </Transition>
        </template>

        <!-- Panneaux favoris et historique -->
        <div class="grid md:grid-cols-2 gap-4">
          <FavoritesPanel @select="handleSearch" />
          <SearchHistory
            :items="history"
            @select="handleSearch"
            @clear="clearHistory"
          />
        </div>
      </div>

      <!-- Footer -->
      <footer class="mt-12 pt-6 border-t border-white/10 text-center">
        <p class="text-sm text-white/40">
          Données fournies par
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white/60 hover:text-white underline-offset-2 hover:underline transition-colors"
          >
            OpenWeatherMap
          </a>
        </p>
      </footer>
    </div>

    <!-- Loading overlay -->
    <LoadingSpinner v-if="loading && current" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Composants
import SearchBar from './components/SearchBar.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import ForecastList from './components/ForecastList.vue'
import WeatherDetails from './components/WeatherDetails.vue'
import SearchHistory from './components/SearchHistory.vue'
import FavoritesPanel from './components/FavoritesPanel.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import SkeletonLoader from './components/SkeletonLoader.vue'
import WeatherBackground from './components/WeatherBackground.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import ToastNotifications from './components/ToastNotifications.vue'

// Composables
import { useWeather } from './composables/useWeather'
import { useGeolocation } from './composables/useGeolocation'
import { useLocalStorage } from './composables/useLocalStorage'

// Utils
import { themeFromCondition } from './utils/themes'

// Constants
const DEFAULT_CITY = 'Montréal, CA'

// State
const { current, forecast, fetchByCity, fetchByCoords, loading } = useWeather()
const { getCoords } = useGeolocation()
const { value: history, push: pushHistory, clear: clearHistory } = useLocalStorage('wp_history', [])
const { value: dark, set: setDark } = useLocalStorage('wp_dark', true)

// Computed
const themeKey = computed(() =>
  themeFromCondition(current.value?.main ?? 'Clear', current.value?.isNight)
)

// Methods
function toggleTheme(val) {
  setDark(val)
  document.documentElement.classList.toggle('dark', val)
}

async function handleSearch(city) {
  if (!city?.trim()) return
  const ok = await fetchByCity(city.trim())
  if (ok) pushHistory(city.trim())
}

async function searchCurrentLocation() {
  const coords = await getCoords()
  if (!coords) return
  await fetchByCoords(coords.lat, coords.lon)
}

// Lifecycle
onMounted(async () => {
  // Appliquer le thème initial
  document.documentElement.classList.toggle('dark', !!dark.value)

  // Essayer la géolocalisation, sinon charger la ville par défaut
  const coords = await getCoords({ silent: true })
  if (coords) {
    await fetchByCoords(coords.lat, coords.lon)
  } else {
    await handleSearch(DEFAULT_CITY)
  }
})

// Mettre à jour le titre de la page selon la ville
watch(current, (val) => {
  if (val?.city) {
    document.title = `${val.city} - WeatherPro`
  } else {
    document.title = 'WeatherPro'
  }
})
</script>

<style>
/* Animations de transition */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade simple */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
