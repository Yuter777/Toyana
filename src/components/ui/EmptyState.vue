<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
      <svg class="w-8 h-8" :class="isDark ? 'text-gray-600' : 'text-gray-400'"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="type === 'search'"
          stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <path v-else-if="type === 'debts'"
          stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <path v-else-if="type === 'chart'"
          stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        <path v-else
          stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 class="text-base font-semibold mb-1.5"
      :class="isDark ? 'text-gray-300' : 'text-gray-700'">
      {{ title }}
    </h3>
    <p class="text-sm max-w-xs"
      :class="isDark ? 'text-gray-500' : 'text-gray-400'">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

defineProps({
  type: {
    type: String,
    default: 'default'
  },
  title: {
    type: String,
    default: 'Nothing here'
  },
  description: {
    type: String,
    default: 'No data to display at the moment.'
  }
})

const { isDark } = useTheme()
</script>
