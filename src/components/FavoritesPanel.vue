<template>
  <section
    class="card glass"
    role="region"
    aria-label="Villes favorites"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold flex items-center gap-2">
        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Favoris
        <span v-if="favorites.length" class="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {{ favorites.length }}
        </span>
      </h3>
      <button
        v-if="favorites.length"
        @click="clearAll"
        class="text-sm text-white/60 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
        aria-label="Supprimer tous les favoris"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Tout effacer
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
            :aria-label="`Voir météo de ${fav.name}`"
          >
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{{ fav.name }}</span>
          </button>
          <button
            @click.stop="removeFavorite(fav.id)"
            class="ml-1 p-1 rounded-full hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Supprimer des favoris"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>

      <div
        v-if="!favorites.length"
        class="text-white/50 text-sm flex items-center gap-2 py-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Aucune ville favorite
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/favorites'
import { useNotificationStore } from '../stores/notifications'

const emit = defineEmits(['select'])

const favoritesStore = useFavoritesStore()
const notifications = useNotificationStore()

const favorites = computed(() => favoritesStore.favorites)

function removeFavorite(id) {
  favoritesStore.remove(id)
  notifications.info('Favori supprimé')
}

function clearAll() {
  favoritesStore.clear()
  notifications.info('Tous les favoris ont été supprimés')
}
</script>

<style scoped>
.favorite-chip {
  @apply flex items-center gap-1 px-3 py-2 rounded-full
         bg-gradient-to-r from-yellow-500/20 to-orange-500/20
         border border-yellow-400/20
         hover:from-yellow-500/30 hover:to-orange-500/30
         hover:border-yellow-400/40
         text-sm font-medium
         transform hover:scale-105
         transition-all duration-200;
}

.favorite-enter-active,
.favorite-leave-active {
  transition: all 0.3s ease;
}

.favorite-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-10deg);
}

.favorite-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(10deg);
}

.favorite-move {
  transition: transform 0.3s ease;
}
</style>
