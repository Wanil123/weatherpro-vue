<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto"
        >
          <div
            :class="[
              'relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl border p-4',
              'transform transition-all duration-300 ease-out',
              typeClasses[notification.type]
            ]"
          >
            <!-- Barre de progression -->
            <div
              v-if="notification.duration > 0"
              class="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
              :style="{
                animation: `shrink ${notification.duration}ms linear forwards`,
                width: '100%'
              }"
            />

            <div class="flex items-start gap-3">
              <!-- Icône -->
              <div :class="['flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', iconBgClasses[notification.type]]">
                <component :is="icons[notification.type]" class="w-5 h-5" />
              </div>

              <!-- Contenu -->
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-sm">{{ notification.title }}</h4>
                <p class="text-sm opacity-90 mt-0.5">{{ notification.message }}</p>
              </div>

              <!-- Bouton fermer -->
              <button
                @click="removeNotification(notification.id)"
                class="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Fermer"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, h } from 'vue'
import { useNotificationStore } from '../stores/notifications'

const store = useNotificationStore()
const notifications = computed(() => store.notifications)

function removeNotification(id) {
  store.remove(id)
}

// Classes par type
const typeClasses = {
  success: 'bg-emerald-500/90 text-white border-emerald-400/30',
  error: 'bg-red-500/90 text-white border-red-400/30',
  warning: 'bg-amber-500/90 text-white border-amber-400/30',
  info: 'bg-blue-500/90 text-white border-blue-400/30'
}

const iconBgClasses = {
  success: 'bg-white/20',
  error: 'bg-white/20',
  warning: 'bg-white/20',
  info: 'bg-white/20'
}

// Icônes SVG comme composants
const icons = {
  success: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 13l4 4L19 7' })
    ])
  },
  error: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 18L18 6M6 6l12 12' })
    ])
  },
  warning: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
    ])
  },
  info: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ])
  }
}
</script>

<style scoped>
.toast-enter-active {
  animation: toast-in 0.4s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
}

.toast-leave-active {
  animation: toast-out 0.3s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes toast-in {
  0% {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toast-out {
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
