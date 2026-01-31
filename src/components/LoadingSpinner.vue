<template>
  <Teleport to="body">
    <Transition name="loader">
      <div
        class="fixed inset-0 grid place-items-center z-50"
        style="background: rgba(5, 5, 16, 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);"
        role="status"
        aria-live="polite"
        :aria-label="t('loadingAria')"
      >
        <div class="flex flex-col items-center gap-6">
          <!-- Loader animé -->
          <div class="loader-container">
            <div class="loader-ring ring-1"></div>
            <div class="loader-ring ring-2"></div>
            <div class="loader-ring ring-3"></div>
            <div class="loader-icon">
              <svg class="w-7 h-7 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
          </div>

          <!-- Texte -->
          <div class="text-center">
            <p class="text-sm font-medium text-white/60 tracking-wide">{{ t('loadingText') }}</p>
            <p class="text-xs text-white/25 mt-1">{{ t('loadingSubtext') }}</p>
          </div>

          <span class="sr-only">{{ t('loadingSr') }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useI18n } from '../i18n/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.loader-container {
  position: relative;
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid transparent;
  animation: spin 1.5s linear infinite;
}

.ring-1 {
  width: 5rem;
  height: 5rem;
  border-top-color: rgba(14, 165, 233, 0.6);
  animation-delay: 0s;
}

.ring-2 {
  width: 4rem;
  height: 4rem;
  border-top-color: rgba(167, 139, 250, 0.5);
  animation-delay: 0.15s;
  animation-direction: reverse;
}

.ring-3 {
  width: 3rem;
  height: 3rem;
  border-top-color: rgba(244, 114, 182, 0.4);
  animation-delay: 0.3s;
}

.loader-icon {
  position: relative;
  z-index: 10;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.7; }
}

.loader-enter-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.loader-leave-active {
  transition: all 0.3s ease-in;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}
</style>
