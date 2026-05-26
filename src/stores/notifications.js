import { defineStore } from 'pinia'
import { ref } from 'vue'

const MAX_NOTIFICATIONS = 5

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])
  let idCounter = 0
  const timers = new Map()
  const remaining = new Map() // ms restants quand pause

  function add({ type = 'info', title = '', message = '', duration = 4000 }) {
    const id = ++idCounter
    const notification = {
      id,
      type,
      title,
      message,
      duration,
      startedAt: Date.now()
    }

    notifications.value.push(notification)

    // Limite la queue : retire les plus anciennes
    while (notifications.value.length > MAX_NOTIFICATIONS) {
      const oldest = notifications.value.shift()
      clearTimerFor(oldest.id)
    }

    if (duration > 0) {
      scheduleRemoval(id, duration)
    }

    return id
  }

  function scheduleRemoval(id, ms) {
    const timer = setTimeout(() => remove(id), ms)
    timers.set(id, timer)
    remaining.set(id, ms)
  }

  function clearTimerFor(id) {
    const timer = timers.get(id)
    if (timer) clearTimeout(timer)
    timers.delete(id)
    remaining.delete(id)
  }

  function pause(id) {
    const n = notifications.value.find(x => x.id === id)
    if (!n || !timers.has(id)) return
    const elapsed = Date.now() - n.startedAt
    const left = Math.max(0, (remaining.get(id) || n.duration) - elapsed)
    clearTimerFor(id)
    remaining.set(id, left)
  }

  function resume(id) {
    const n = notifications.value.find(x => x.id === id)
    if (!n) return
    const left = remaining.get(id)
    if (left == null || left <= 0) return
    n.startedAt = Date.now()
    scheduleRemoval(id, left)
  }

  function remove(id) {
    clearTimerFor(id)
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) notifications.value.splice(index, 1)
  }

  function clear() {
    for (const timer of timers.values()) clearTimeout(timer)
    timers.clear()
    remaining.clear()
    notifications.value = []
  }

  // Helpers : signature (message, title) — title vide n'est PAS dupliqué (cf. composant Toast)
  function success(message, title) {
    return add({ type: 'success', title: title || '', message })
  }

  function error(message, title) {
    return add({ type: 'error', title: title || '', message, duration: 6000 })
  }

  function warning(message, title) {
    return add({ type: 'warning', title: title || '', message })
  }

  function info(message, title) {
    return add({ type: 'info', title: title || '', message })
  }

  return {
    notifications,
    add,
    remove,
    pause,
    resume,
    clear,
    success,
    error,
    warning,
    info
  }
})
