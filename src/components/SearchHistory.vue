<template>
  <section
    class="history-card"
    role="region"
    :aria-label="t('historyAria')"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold flex items-center gap-2 text-white/50 uppercase tracking-wider">
        <svg class="w-4 h-4 text-violet-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ t('historyTitle') }}
      </h3>
      <button
        v-if="items.length"
        @click="$emit('clear')"
        class="clear-btn"
        :aria-label="t('clearHistoryAria')"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>{{ t('clearHistory') }}</span>
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
          :aria-label="t('searchCity', { city })"
        >
          <svg class="w-3.5 h-3.5 text-white/25 group-hover:text-violet-400/60 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-sm text-white/50 group-hover:text-white/80 transition-colors duration-300">{{ city }}</span>
        </button>
      </TransitionGroup>

      <div
        v-if="!items.length"
        class="text-white/25 text-xs flex items-center gap-2 py-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ t('noHistory') }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from '../i18n/useI18n'

const { t } = useI18n()

defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['select', 'clear'])
</script>

<style scoped>
.history-card {
  padding: 1.25rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.history-card:hover {
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

.history-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-chip:hover {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.15);
  transform: translateY(-1px);
}

.history-enter-active,
.history-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.history-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(8px);
}

.history-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.history-move {
  transition: transform 0.3s ease;
}
</style>
