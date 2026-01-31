<template>
  <section
    class="favorites-card"
    role="region"
    :aria-label="t('favoritesAria')"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold flex items-center gap-2 text-white/50 uppercase tracking-wider">
        <svg class="w-4 h-4 text-amber-400/60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        {{ t('favoritesTitle') }}
        <span v-if="favorites.length" class="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
              style="background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.15);">
          {{ favorites.length }}
        </span>
      </h3>
      <button
        v-if="favorites.length"
        @click="clearAll"
        class="clear-btn"
        :aria-label="t('clearAllFavoritesAria')"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>{{ t('clearAll') }}</span>
      </button>
    </div>

    <div class="flex flex-wrap gap-2" role="list">
      <TransitionGroup name="favorite">
        <div
          v-for="fav in favorites"
          :key="fav.id"
          class="favorite-chip group"
          role="listitem"
        >
          <button
            @click="$emit('select', fav.name)"
            class="flex items-center gap-2"
            :aria-label="t('viewCityWeather', { city: fav.name })"
          >
            <svg class="w-3.5 h-3.5 text-amber-400/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span class="text-sm text-white/70">{{ fav.name }}</span>
          </button>
          <button
            @click.stop="removeFavorite(fav.id)"
            class="ml-1 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
            style="background: rgba(255,255,255,0.05);"
            :aria-label="t('removeFavoriteAria')"
          >
            <svg class="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>

      <div
        v-if="!favorites.length"
        class="text-white/25 text-xs flex items-center gap-2 py-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        {{ t('noFavorites') }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/favorites'
import { useNotificationStore } from '../stores/notifications'
import { useI18n } from '../i18n/useI18n'

const emit = defineEmits(['select'])
const { t } = useI18n()

const favoritesStore = useFavoritesStore()
const notifications = useNotificationStore()

const favorites = computed(() => favoritesStore.favorites)

function removeFavorite(id) {
  favoritesStore.remove(id)
  notifications.info(t('favoriteRemoved'))
}

function clearAll() {
  favoritesStore.clear()
  notifications.info(t('allFavoritesCleared'))
}
</script>

<style scoped>
.favorites-card {
  padding: 1.25rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.favorites-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
}

.favorite-chip {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.625rem;
  background: rgba(251, 191, 36, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.favorite-chip:hover {
  background: rgba(251, 191, 36, 0.12);
  border-color: rgba(251, 191, 36, 0.2);
  transform: translateY(-1px);
}

.favorite-enter-active,
.favorite-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.favorite-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-5deg);
}

.favorite-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(5deg);
}

.favorite-move {
  transition: transform 0.3s ease;
}
</style>
