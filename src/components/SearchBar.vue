<template>
  <div class="card glass">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <!-- Barre de recherche principale -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model.trim="query"
          type="text"
          placeholder="Rechercher une ville (ex: Paris, FR)"
          class="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 dark:bg-white/10
                 border border-white/20 dark:border-white/10
                 outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent
                 placeholder:text-white/50 text-lg
                 transition-all duration-300"
          aria-label="Rechercher une ville"
          :disabled="loading"
        />
      </div>

      <!-- Boutons d'action -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          :disabled="loading || !query"
          class="btn-primary flex-1"
          aria-label="Rechercher"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Rechercher</span>
        </button>

        <button
          type="button"
          :disabled="loading"
          @click="$emit('geolocate')"
          class="btn-secondary flex-1 sm:flex-none"
          aria-label="Utiliser ma position"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Ma position</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['search', 'geolocate'])
const query = ref('')

function onSubmit() {
  if (!query.value) return
  emit('search', query.value)
}
</script>

<style scoped>
.btn-primary {
  @apply flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
         bg-gradient-to-r from-blue-500 to-blue-600
         hover:from-blue-600 hover:to-blue-700
         text-white font-medium
         shadow-lg shadow-blue-500/25
         disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
         transform hover:scale-[1.02] active:scale-[0.98]
         transition-all duration-200;
}

.btn-secondary {
  @apply flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
         bg-white/20 dark:bg-white/10
         hover:bg-white/30 dark:hover:bg-white/20
         border border-white/20
         text-white font-medium
         disabled:opacity-50 disabled:cursor-not-allowed
         transform hover:scale-[1.02] active:scale-[0.98]
         transition-all duration-200;
}
</style>
