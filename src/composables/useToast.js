import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function useToast() {
  function addToast({ message, type = 'info', duration = 3500 }) {
    const id = nextId++
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message) {
    addToast({ message, type: 'success' })
  }

  function error(message) {
    addToast({ message, type: 'error', duration: 5000 })
  }

  function info(message) {
    addToast({ message, type: 'info' })
  }

  function warning(message) {
    addToast({ message, type: 'warning' })
  }

  return { toasts, addToast, removeToast, success, error, info, warning }
}
