<template>
  <Teleport to="body">
    <Transition name="loader">
      <div
        class="fixed inset-0 grid place-items-center bg-black/30 backdrop-blur-sm z-50"
        role="status"
        aria-live="polite"
        aria-label="Chargement en cours"
      >
        <div class="flex flex-col items-center gap-6">
          <!-- Loader animé -->
          <div class="loader-container">
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
            <!-- Icône météo au centre -->
            <div class="loader-icon">
              <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
          </div>

          <!-- Texte de chargement -->
          <div class="text-center">
            <p class="text-white font-medium text-lg">Chargement des données météo</p>
            <p class="text-white/60 text-sm mt-1">Veuillez patienter...</p>
          </div>

          <!-- Texte pour lecteurs d'écran -->
          <span class="sr-only">Chargement en cours, veuillez patienter</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
</script>

<style scoped>
.loader-container {
  @apply relative w-24 h-24 flex items-center justify-center;
}

.loader-ring {
  @apply absolute rounded-full border-2 border-transparent;
  border-top-color: rgba(255, 255, 255, 0.8);
  animation: spin 1.5s linear infinite;
}

.loader-ring:nth-child(1) {
  @apply w-24 h-24;
  animation-delay: 0s;
}

.loader-ring:nth-child(2) {
  @apply w-20 h-20;
  animation-delay: 0.15s;
  animation-direction: reverse;
}

.loader-ring:nth-child(3) {
  @apply w-16 h-16;
  animation-delay: 0.3s;
}

.loader-icon {
  @apply relative z-10;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* Transitions d'entrée/sortie */
.loader-enter-active {
  transition: all 0.3s ease-out;
}

.loader-leave-active {
  transition: all 0.3s ease-in;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}
</style>
