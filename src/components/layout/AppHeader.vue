<template>
  <header class="sticky top-0 z-40 border-b transition-all duration-200"
    :class="isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'"
    style="backdrop-filter: blur(12px);">
    <div class="flex items-center justify-between h-16 px-4 md:px-6">
      <!-- Mobile menu button -->
      <button
        class="md:hidden p-2 rounded-lg transition-colors duration-200"
        :class="isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'"
        @click="$emit('toggle-sidebar')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Logo (mobile only) -->
      <div class="flex items-center gap-2 md:hidden">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="font-bold text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">Toyana</span>
      </div>

      <!-- Right section -->
      <div class="flex items-center gap-2 ml-auto">
        <!-- Last updated -->
        <span v-if="lastUpdated" class="hidden sm:block text-xs"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          Updated {{ formatTime(lastUpdated) }}
        </span>

        <!-- Refresh button -->
        <button
          class="p-2 rounded-lg transition-all duration-200"
          :class="[
            isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700',
            loading ? 'animate-spin' : ''
          ]"
          :disabled="loading"
          @click="$emit('refresh')"
          title="Refresh data"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <!-- Theme toggle -->
        <button
          class="p-2 rounded-lg transition-all duration-200"
          :class="isDark ? 'hover:bg-gray-800 text-amber-400 hover:text-amber-300' : 'hover:bg-gray-100 text-indigo-500 hover:text-indigo-600'"
          @click="toggleTheme"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Sun icon -->
          <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon -->
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const props = defineProps({
  loading: Boolean,
  lastUpdated: [Date, null]
})

defineEmits(['toggle-sidebar', 'refresh'])

const { isDark, toggleTheme } = useTheme()

function formatTime(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
