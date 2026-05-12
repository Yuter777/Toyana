<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <transition-group name="toast" tag="div" class="flex flex-col gap-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[280px] max-w-sm border transition-all duration-300"
          :class="toastClass(toast.type)"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 w-5 h-5" v-html="toastIcon(toast.type)" />

          <!-- Message -->
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>

          <!-- Close -->
          <button
            class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            @click="removeToast(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

function toastClass(type) {
  const classes = {
    success: 'bg-emerald-900/90 border-emerald-700/50 text-emerald-100',
    error: 'bg-red-900/90 border-red-700/50 text-red-100',
    warning: 'bg-amber-900/90 border-amber-700/50 text-amber-100',
    info: 'bg-indigo-900/90 border-indigo-700/50 text-indigo-100'
  }
  return classes[type] || classes.info
}

function toastIcon(type) {
  const icons = {
    success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-emerald-400">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
    error: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-red-400">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
    warning: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-amber-400">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>`,
    info: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-indigo-400">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>
