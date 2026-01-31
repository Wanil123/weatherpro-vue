<template>
  <!-- Background layers -->
  <WeatherBackground :theme="themeKey" />
  <ParticleCanvas :theme="themeKey" :mouseX="mouseX" :mouseY="mouseY" />
  <ToastNotifications />

  <main class="min-h-screen min-h-[100dvh] relative z-10" @mousemove="onMouseMove">
    <div class="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 md:py-12">

      <!-- Header -->
      <header class="flex items-center justify-between mb-6 sm:mb-10">
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="relative logo-float">
            <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center border-gradient"
                 style="background: rgba(255,255,255,0.04);">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#050510]" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gradient-brand">
              {{ t('appTitle') }}
            </h1>
            <p class="text-[10px] sm:text-[11px] text-white/30 tracking-wider uppercase hidden sm:block">{{ t('appSubtitle') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Language toggle -->
          <button
            @click="toggleLang"
            class="lang-toggle"
            :aria-label="lang === 'fr' ? 'Switch to English' : 'Passer en français'"
          >
            <span class="lang-flag">{{ lang === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
            <span class="lang-code">{{ t('langLabel') }}</span>
          </button>

        </div>
      </header>

      <!-- Content -->
      <div class="space-y-5 sm:space-y-8">

        <!-- Search -->
        <SearchBar :loading="loading" @search="handleSearch" @geolocate="searchCurrentLocation" />

        <!-- Greeting -->
        <Transition name="slide-fade" mode="out-in">
          <WeatherGreeting
            v-if="current"
            :key="current.city + lang"
            :city="current.city"
            :isNight="current.isNight"
            :temperature="current.temperature"
          />
        </Transition>

        <!-- Skeletons -->
        <template v-if="loading && !current">
          <div class="grid md:grid-cols-2 gap-4 sm:gap-5">
            <SkeletonLoader type="current" />
            <SkeletonLoader type="details" />
          </div>
          <SkeletonLoader type="forecast" />
        </template>

        <!-- Weather data -->
        <template v-else>
          <Transition name="slide-fade" mode="out-in">
            <div v-if="current" :key="current.city + '-main'" class="grid md:grid-cols-2 gap-4 sm:gap-5">
              <CurrentWeather :data="current" />
              <WeatherDetails :data="current" />
            </div>
          </Transition>

          <Transition name="slide-fade" mode="out-in">
            <ForecastList v-if="forecast.length" :key="current?.city + '-forecast'" :items="forecast" />
          </Transition>
        </template>

        <!-- Favorites & History -->
        <div class="grid md:grid-cols-2 gap-4 sm:gap-5">
          <FavoritesPanel @select="handleSearch" />
          <SearchHistory :items="history" @select="handleSearch" @clear="clearHistory" />
        </div>
      </div>

      <!-- Footer -->
      <footer class="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 text-center">
        <p class="text-[10px] sm:text-xs text-white/25">
          {{ t('footerData') }}
          <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer"
             class="text-white/40 hover:text-sky-400 transition-colors duration-300">
            OpenWeatherMap
          </a>
          · {{ t('footerBuilt') }}
        </p>
      </footer>
    </div>

    <LoadingSpinner v-if="loading && current" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SearchBar from './components/SearchBar.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import ForecastList from './components/ForecastList.vue'
import WeatherDetails from './components/WeatherDetails.vue'
import SearchHistory from './components/SearchHistory.vue'
import FavoritesPanel from './components/FavoritesPanel.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import SkeletonLoader from './components/SkeletonLoader.vue'
import WeatherBackground from './components/WeatherBackground.vue'
import ToastNotifications from './components/ToastNotifications.vue'
import ParticleCanvas from './components/ParticleCanvas.vue'
import WeatherGreeting from './components/WeatherGreeting.vue'
import { useWeather } from './composables/useWeather'
import { useGeolocation } from './composables/useGeolocation'
import { useLocalStorage } from './composables/useLocalStorage'
import { themeFromCondition } from './utils/themes'
import { useI18n } from './i18n/useI18n'

const DEFAULT_CITY = 'Montréal, CA'

const { t, lang, toggleLang } = useI18n()
const { current, forecast, fetchByCity, fetchByCoords, loading } = useWeather()
const { getCoords } = useGeolocation()
const { value: history, push: pushHistory, clear: clearHistory } = useLocalStorage('wp_history', [])

const mouseX = ref(0)
const mouseY = ref(0)
function onMouseMove(e) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const themeKey = computed(() =>
  themeFromCondition(current.value?.main ?? 'Clear', current.value?.isNight)
)

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

// Re-fetch weather data when language changes (to get translated descriptions from API)
watch(lang, async () => {
  if (current.value?.city) {
    await fetchByCity(`${current.value.city}, ${current.value.country}`)
  }
})

onMounted(async () => {
  const coords = await getCoords({ silent: true })
  if (coords) {
    await fetchByCoords(coords.lat, coords.lon)
  } else {
    await handleSearch(DEFAULT_CITY)
  }
})

watch(current, (val) => {
  document.title = val?.city ? `${val.city} - WeatherPro` : 'WeatherPro'
})
</script>

<style>
.slide-fade-enter-active { transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-fade-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-fade-enter-from { opacity: 0; transform: translateY(24px); }
.slide-fade-leave-to { opacity: 0; transform: translateY(-12px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.logo-float { animation: logo-float 4s ease-in-out infinite; }
@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.lang-toggle {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.lang-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.lang-flag {
  font-size: 0.875rem;
  line-height: 1;
}

.lang-code {
  font-weight: 600;
  font-size: 0.625rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
