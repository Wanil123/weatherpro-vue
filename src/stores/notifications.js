import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])
  let idCounter = 0

  function add({ type = 'info', title, message, duration = 4000 }) {
    const id = ++idCounter
    const notification = {
      id,
      type, // 'success', 'error', 'warning', 'info'
      title,
      message,
      duration
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }

    return id
  }

  function remove(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clear() {
    notifications.value = []
  }

  // Raccourcis pratiques
  function success(message, title = 'Succès') {
    return add({ type: 'success', title, message })
  }

  function error(message, title = 'Erreur') {
    return add({ type: 'error', title, message, duration: 6000 })
  }

  function warning(message, title = 'Attention') {
    return add({ type: 'warning', title, message })
  }

  function info(message, title = 'Info') {
    return add({ type: 'info', title, message })
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
