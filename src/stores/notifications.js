import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])
  let idCounter = 0
  const timers = new Map()

  function add({ type = 'info', title, message, duration = 4000 }) {
    const id = ++idCounter
    const notification = {
      id,
      type,
      title,
      message,
      duration
    }

    notifications.value.push(notification)

    if (duration > 0) {
      const timer = setTimeout(() => remove(id), duration)
      timers.set(id, timer)
    }

    return id
  }

  function remove(id) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clear() {
    for (const timer of timers.values()) {
      clearTimeout(timer)
    }
    timers.clear()
    notifications.value = []
  }

  function success(message, title) {
    return add({ type: 'success', title: title || message, message })
  }

  function error(message, title) {
    return add({ type: 'error', title: title || message, message, duration: 6000 })
  }

  function warning(message, title) {
    return add({ type: 'warning', title: title || message, message })
  }

  function info(message, title) {
    return add({ type: 'info', title: title || message, message })
  }

  return {
    notifications,
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
})
