<template>
  <div class="search-card">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3 sm:gap-4">
      <!-- Search input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300" :class="isFocused ? 'text-sky-400' : 'text-white/20'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model.trim="query"
          type="text"
          :placeholder="t('searchPlaceholder')"
          class="search-input"
          :aria-label="t('searchAriaLabel')"
          :disabled="loading"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <div class="absolute inset-0 rounded-xl pointer-events-none transition-all duration-500"
             :style="isFocused ? 'box-shadow: 0 0 30px rgba(14, 165, 233, 0.08), inset 0 0 0 1px rgba(14, 165, 233, 0.25);' : ''" />
      </div>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <button v-ripple type="submit" :disabled="loading || !query" class="search-btn-primary flex-1" :aria-label="t('searchBtn')">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>{{ t('searchBtn') }}</span>
        </button>

        <button v-ripple type="button" :disabled="loading" @click="$emit('geolocate')" class="search-btn-secondary flex-1 sm:flex-none" :aria-label="t('geolocateAriaLabel')">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
</script>

<style scoped>
.search-card {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .search-card { padding: 1.25rem; }
}

.search-card:focus-within {
  border-color: rgba(14, 165, 233, 0.15);
}

.search-input {
  width: 100%;
  padding: 0.875rem 0.875rem 0.875rem 2.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: white;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .search-input {
    padding: 1rem 1rem 1rem 3rem;
    font-size: 1rem;
  }
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(14, 165, 233, 0.3);
}

.search-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.8125rem;
  color: white;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.2);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

@media (min-width: 640px) {
  .search-btn-primary {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
  }
}

.search-btn-primary:hover:not(:disabled) {
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.3);
  transform: translateY(-1px);
}

.search-btn-primary:active:not(:disabled) { transform: scale(0.97); }
.search-btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }

.search-btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

@media (min-width: 640px) {
  .search-btn-secondary {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
  }
}

.search-btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.search-btn-secondary:active:not(:disabled) { transform: scale(0.97); }
.search-btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; }
</style>
