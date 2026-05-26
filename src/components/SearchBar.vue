<template>
  <div class="search-card" role="search">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3 sm:gap-4">
      <!-- Search input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none" aria-hidden="true">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300" :class="isFocused ? 'text-sky-400' : 'text-white/30'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model.trim="query"
          type="search"
          inputmode="search"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="words"
          spellcheck="false"
          :placeholder="t('searchPlaceholder')"
          class="search-input"
          :aria-label="t('searchAriaLabel')"
          :disabled="loading"
          :aria-busy="loading"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <!-- Clear input -->
        <button
          v-if="query && !loading"
          type="button"
          @click="clear"
          class="clear-input-btn"
          :aria-label="t('clearInputAria')"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <button v-ripple type="submit" :disabled="loading || !query" class="search-btn-primary flex-1">
          <svg v-if="!loading" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="2.5" />
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2.5" d="M21 12a9 9 0 00-9-9" />
          </svg>
          <span>{{ loading ? t('searching') : t('searchBtn') }}</span>
        </button>

        <button v-ripple type="button" :disabled="loading" @click="emit('geolocate')" class="search-btn-secondary flex-1 sm:flex-none" :aria-label="t('geolocateAriaLabel')">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ t('geolocateBtn') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../i18n/useI18n'

defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['search', 'geolocate'])
const { t } = useI18n()
const query = ref('')
const isFocused = ref(false)

function onSubmit() {
  if (!query.value) return
  emit('search', query.value)
}

function clear() {
  query.value = ''
}
</script>

<style scoped>
.search-card {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

@media (min-width: 640px) {
  .search-card { padding: 1.25rem; }
}

.search-card:focus-within {
  border-color: rgba(14, 165, 233, 0.25);
  background: rgba(255, 255, 255, 0.04);
}

.search-input {
  width: 100%;
  padding: 0.875rem 2.75rem 0.875rem 2.75rem;
  min-height: 44px;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 0.9375rem;
  outline: none;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  /* Retire le X natif du type=search dans certains browsers */
  -webkit-appearance: none;
}
.search-input::-webkit-search-cancel-button { display: none; }

@media (min-width: 640px) {
  .search-input {
    padding: 1rem 3rem 1rem 3rem;
    font-size: 1rem;
  }
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.search-input:focus,
.search-input:focus-visible {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(14, 165, 233, 0.45);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.search-input:disabled {
  opacity: 0.6;
  cursor: wait;
}

.clear-input-btn {
  position: absolute;
  top: 50%;
  right: 0.375rem;
  transform: translateY(-50%);
  /* Zone tactile WCAG-conforme : visuel compact mais hit-area pleine */
  min-width: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.clear-input-btn:hover { background: rgba(255, 255, 255, 0.14); color: white; }
.clear-input-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.55);
}

/* Buttons */
.search-btn-primary,
.search-btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  border: 1px solid transparent;
}

.search-btn-primary {
  color: white;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.25);
}
.search-btn-primary:hover:not(:disabled) {
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.4);
  transform: translateY(-1px);
}
.search-btn-primary:active:not(:disabled) { transform: scale(0.97); }
.search-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.search-btn-primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.5);
}

.search-btn-secondary {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}
.search-btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.18);
}
.search-btn-secondary:active:not(:disabled) { transform: scale(0.97); }
.search-btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
.search-btn-secondary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

@media (prefers-reduced-motion: reduce) {
  .search-input, .search-btn-primary, .search-btn-secondary, .clear-input-btn,
  .search-card { transition: none; }
  .search-btn-primary:hover:not(:disabled),
  .search-btn-primary:active:not(:disabled),
  .search-btn-secondary:hover:not(:disabled),
  .search-btn-secondary:active:not(:disabled) { transform: none; }
}
</style>
