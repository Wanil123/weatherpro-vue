<template>
  <section
    class="history-card"
    role="region"
    :aria-label="t('historyAria')"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold flex items-center gap-2 text-white/60 uppercase tracking-wider">
        <svg class="w-4 h-4 text-violet-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ t('historyTitle') }}
      </h3>
      <button
        v-if="items.length"
        type="button"
        @click="onClear"
        class="clear-btn"
        :aria-label="t('clearHistoryAria')"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>{{ t('clearHistory') }}</span>
      </button>
    </div>

    <TransitionGroup
      name="history"
      tag="div"
      class="flex flex-wrap gap-2"
      role="list"
    >
      <button
        v-for="(city, idx) in items"
        :key="`${city}-${idx}`"
        type="button"
        @click="$emit('select', city)"
        class="history-chip group"
        role="listitem"
        :aria-label="t('searchCity', { city })"
      >
        <svg class="w-3.5 h-3.5 text-white/40 group-hover:text-violet-400/80 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-sm text-white/65 group-hover:text-white/95 transition-colors duration-300 truncate max-w-[160px]">{{ city }}</span>
      </button>

      <div
        v-if="!items.length"
        key="empty"
        class="text-white/40 text-xs flex items-center gap-2 py-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ t('noHistory') }}
      </div>
    </TransitionGroup>
  </section>
</template>

<script setup>
import { useI18n } from '../i18n/useI18n'

const { t } = useI18n()
const emit = defineEmits(['select', 'clear'])

const props = defineProps({
  items: { type: Array, default: () => [] }
})

function onClear() {
  if (props.items.length > 1 && typeof window !== 'undefined') {
    if (!window.confirm(t('confirmClearHistory'))) return
  }
  emit('clear')
}
</script>

<style scoped>
.history-card {
  padding: 1.25rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: background-color 0.4s ease, border-color 0.4s ease;
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
  min-height: 32px;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.clear-btn:hover { color: rgba(255, 255, 255, 0.95); background: rgba(255, 255, 255, 0.06); }
.clear-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.5);
}

.history-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  min-height: 36px;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
  color: inherit;
}
.history-chip:hover {
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.22);
  transform: translateY(-1px);
}
.history-chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.55);
}

.history-enter-active,
.history-leave-active {
  transition: opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.history-enter-from { opacity: 0; transform: scale(0.88) translateY(6px); }
.history-leave-to   { opacity: 0; transform: scale(0.88); }
.history-move       { transition: transform 0.3s ease; }

@media (prefers-reduced-motion: reduce) {
  .history-card, .history-chip { transition: none; }
  .history-chip:hover { transform: none; }
  .history-enter-active, .history-leave-active, .history-move { transition: opacity 0.2s ease; }
  .history-enter-from, .history-leave-to { transform: none; }
}
</style>
