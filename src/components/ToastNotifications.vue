<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto"
        >
          <div class="toast-card" :class="typeClasses[notification.type]">
            <!-- Progress bar -->
            <div
              v-if="notification.duration > 0"
              class="absolute bottom-0 left-0 h-[2px] rounded-full"
              :class="barClasses[notification.type]"
              :style="{
                animation: `shrink ${notification.duration}ms linear forwards`,
                width: '100%'
              }"
            />

            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                   :class="iconBgClasses[notification.type]">
                <component :is="icons[notification.type]" class="w-4 h-4" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-xs text-white/90">{{ notification.title }}</h4>
                <p class="text-xs text-white/60 mt-0.5">{{ notification.message }}</p>
              </div>

              <!-- Close -->
              <button
                @click="removeNotification(notification.id)"
                class="flex-shrink-0 p-1 rounded-lg transition-colors duration-200"
                style="background: rgba(255,255,255,0.05);"
                :aria-label="t('closeAria')"
              >
                <svg class="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
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
import { useI18n } from '../i18n/useI18n'

const { t } = useI18n()
const store = useNotificationStore()
const notifications = computed(() => store.notifications)

function removeNotification(id) {
  store.remove(id)
}

const typeClasses = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info'
}

const iconBgClasses = {
  success: 'bg-emerald-500/15',
  error: 'bg-red-500/15',
  warning: 'bg-amber-500/15',
  info: 'bg-sky-500/15'
}

const barClasses = {
  success: 'bg-emerald-400/40',
  error: 'bg-red-400/40',
  warning: 'bg-amber-400/40',
  info: 'bg-sky-400/40'
}

const icons = {
  success: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-emerald-400' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 13l4 4L19 7' })
    ])
  },
  error: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-red-400' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 18L18 6M6 6l12 12' })
    ])
  },
  warning: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-amber-400' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
    ])
  },
  info: {
    render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'text-sky-400' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ])
  }
}
</script>

<style scoped>
.toast-card {
  position: relative;
  overflow: hidden;
  border-radius: 0.875rem;
  padding: 0.875rem;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  transition: all 0.3s ease;
}

.toast-success {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.toast-error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.toast-warning {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.toast-info {
  background: rgba(14, 165, 233, 0.12);
  border: 1px solid rgba(14, 165, 233, 0.2);
}

.toast-enter-active {
  animation: toast-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.toast-leave-active {
  animation: toast-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes toast-in {
  0% { opacity: 0; transform: translateX(100%) scale(0.9); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes toast-out {
  0% { opacity: 1; transform: translateX(0) scale(1); }
  100% { opacity: 0; transform: translateX(100%) scale(0.9); }
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
