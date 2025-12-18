<template>
  <section
    class="card glass"
    role="region"
    aria-label="Historique de recherche"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold flex items-center gap-2">
        <svg class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Historique
      </h3>
      <button
        v-if="items.length"
        @click="$emit('clear')"
        class="text-sm text-white/60 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
        aria-label="Effacer l'historique"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Effacer
      </button>
    </div>

    <div class="flex flex-wrap gap-2" role="list">
      <TransitionGroup name="history">
        <button
          v-for="city in items"
          :key="city"
          @click="$emit('select', city)"
          class="history-chip group"
          role="listitem"
          :aria-label="`Rechercher ${city}`"
        >
          <svg class="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ city }}</span>
        </button>
      </TransitionGroup>

      <div
        v-if="!items.length"
        class="text-white/50 text-sm flex items-center gap-2 py-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Aucune recherche récente
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['select', 'clear'])
</script>

<style scoped>
.history-chip {
  @apply flex items-center gap-2 px-4 py-2 rounded-full
         bg-white/10 dark:bg-white/5
         border border-white/10
         hover:bg-white/20 dark:hover:bg-white/15
         hover:border-white/20
         text-sm font-medium
         transform hover:scale-105
         transition-all duration-200;
}

.history-enter-active,
.history-leave-active {
  transition: all 0.3s ease;
}

.history-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.history-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.history-move {
  transition: transform 0.3s ease;
}
</style>
