<template>
  <Teleport to="body">
    <!-- aria-live region : annonces continues mais polies pour info/success, assertive pour error/warning -->
    <div
      class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      <!-- Polite region (info / success) -->
      <div aria-live="polite" aria-atomic="false" class="contents">
        <TransitionGroup name="toast">
          <div
            v-for="n in politeNotifications"
            :key="n.id"
            class="pointer-events-auto"
            @mouseenter="pauseTimer(n.id)"
            @mouseleave="resumeTimer(n.id)"
            @focusin="pauseTimer(n.id)"
            @focusout="resumeTimer(n.id)"
          >
            <ToastItem :notification="n" @close="removeNotification" />
          </div>
        </TransitionGroup>
      </div>

      <!-- Assertive region (error / warning) -->
      <div aria-live="assertive" aria-atomic="false" class="contents">
        <TransitionGroup name="toast">
          <div
            v-for="n in assertiveNotifications"
            :key="n.id"
            class="pointer-events-auto"
            role="alert"
            @mouseenter="pauseTimer(n.id)"
            @mouseleave="resumeTimer(n.id)"
            @focusin="pauseTimer(n.id)"
            @focusout="resumeTimer(n.id)"
          >
            <ToastItem :notification="n" @close="removeNotification" />
          </div>
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, h, defineComponent, markRaw } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import { useI18n } from '../i18n/useI18n'

const { t } = useI18n()
const store = useNotificationStore()
const notifications = computed(() => store.notifications)

const politeNotifications = computed(() =>
  notifications.value.filter(n => n.type === 'info' || n.type === 'success')
)
const assertiveNotifications = computed(() =>
  notifications.value.filter(n => n.type === 'error' || n.type === 'warning')
)

function removeNotification(id) { store.remove(id) }
function pauseTimer(id) { store.pause(id) }
function resumeTimer(id) { store.resume(id) }

// Item component encapsulé pour rester DRY entre les deux régions live
const ToastItem = markRaw(defineComponent({
  props: {
    notification: { type: Object, required: true }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const TYPE_CLASSES = {
      success: { card: 'toast-success', bg: 'bg-emerald-500/15', bar: 'toast-bar-success', icon: 'text-emerald-400' },
      error:   { card: 'toast-error',   bg: 'bg-red-500/15',     bar: 'toast-bar-error',   icon: 'text-red-400' },
      warning: { card: 'toast-warning', bg: 'bg-amber-500/15',   bar: 'toast-bar-warning', icon: 'text-amber-400' },
      info:    { card: 'toast-info',    bg: 'bg-sky-500/15',     bar: 'toast-bar-info',    icon: 'text-sky-400' }
    }

    const ICONS = {
      success: 'M5 13l4 4L19 7',
      error:   'M12 9v3m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.7-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z',
      warning: 'M12 9v2m0 4h.01m-6.94 4h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.7-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z',
      info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }

    return () => {
      const n = props.notification
      const cls = TYPE_CLASSES[n.type] || TYPE_CLASSES.info
      const showTitle = !!n.title && n.title !== n.message
      const hasMessage = !!n.message

      return h('div', { class: ['toast-card', cls.card] }, [
        // Progress bar (transform scale, pas width)
        n.duration > 0 ? h('div', {
          class: ['toast-progress', cls.bar],
          style: { animationDuration: `${n.duration}ms` }
        }) : null,

        h('div', { class: 'flex items-start gap-3' }, [
          // Icon
          h('div', { class: ['flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', cls.bg] }, [
            h('svg', {
              class: ['w-4 h-4', cls.icon],
              fill: 'none',
              viewBox: '0 0 24 24',
              stroke: 'currentColor',
              'aria-hidden': 'true'
            }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: ICONS[n.type] })
            ])
          ]),
          // Content
          h('div', { class: 'flex-1 min-w-0' }, [
            showTitle ? h('h4', { class: 'font-semibold text-xs text-white/90' }, n.title) : null,
            hasMessage ? h('p', { class: ['text-xs text-white/70', showTitle ? 'mt-0.5' : ''] }, n.message) : null
          ]),
          // Close
          h('button', {
            type: 'button',
            onClick: () => emit('close', n.id),
            class: 'flex-shrink-0 p-1.5 rounded-lg transition-colors duration-200 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40',
            'aria-label': t('closeAria')
          }, [
            h('svg', { class: 'w-3.5 h-3.5 text-white/60', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'aria-hidden': 'true' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 18L18 6M6 6l12 12' })
            ])
          ])
        ])
      ])
    }
  }
}))
</script>

<style>
.toast-card {
  position: relative;
  overflow: hidden;
  border-radius: 0.875rem;
  padding: 0.875rem;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.04) inset;
}

.toast-success { background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.22); }
.toast-error   { background: rgba(239, 68, 68, 0.12);  border: 1px solid rgba(239, 68, 68, 0.22); }
.toast-warning { background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.22); }
.toast-info    { background: rgba(14, 165, 233, 0.12); border: 1px solid rgba(14, 165, 233, 0.22); }

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  transform-origin: left center;
  animation-name: toast-shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
.toast-bar-success { background: rgba(16, 185, 129, 0.55); }
.toast-bar-error   { background: rgba(239, 68, 68, 0.55); }
.toast-bar-warning { background: rgba(245, 158, 11, 0.55); }
.toast-bar-info    { background: rgba(14, 165, 233, 0.55); }

@keyframes toast-shrink {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

.toast-enter-active { animation: toast-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.toast-leave-active { animation: toast-out 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards; position: absolute; right: 0; left: 0; }
.toast-move { transition: transform 0.3s ease; }

@keyframes toast-in {
  0%   { opacity: 0; transform: translateX(110%) scale(0.96); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toast-out {
  0%   { opacity: 1; transform: translateX(0) scale(1); }
  100% { opacity: 0; transform: translateX(110%) scale(0.96); }
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active, .toast-leave-active { animation: none !important; }
  .toast-progress { animation: none !important; transform: scaleX(0); }
}
</style>
