<template>
  <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
    <!-- Search -->
    <div class="relative flex-1 min-w-[200px]">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or note..."
        class="input-field pl-9"
      />
    </div>

    <!-- Status filter -->
    <div class="flex items-center gap-1.5 flex-wrap">
      <button
        v-for="status in statusOptions"
        :key="status"
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
        :class="statusFilter === status
          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
          : isDark
            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'"
        @click="statusFilter = status"
      >
        {{ status }}
      </button>
    </div>

    <!-- Unpaid toggle -->
    <label class="flex items-center gap-2 cursor-pointer select-none group">
      <div class="relative">
        <input type="checkbox" v-model="unpaidOnly" class="sr-only peer" />
        <div class="w-9 h-5 rounded-full transition-colors duration-200"
          :class="unpaidOnly
            ? 'bg-indigo-500'
            : isDark ? 'bg-gray-700' : 'bg-gray-300'">
        </div>
        <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          :class="unpaidOnly ? 'translate-x-4' : 'translate-x-0'">
        </div>
      </div>
      <span class="text-xs font-medium"
        :class="isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'">
        Unpaid only
      </span>
    </label>

    <!-- Reset -->
    <button
      v-if="searchQuery || statusFilter !== 'All' || unpaidOnly"
      class="flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
      :class="isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'"
      @click="resetFilters"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Clear
    </button>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const searchQuery = defineModel('searchQuery')
const statusFilter = defineModel('statusFilter')
const unpaidOnly = defineModel('unpaidOnly')

defineProps({
  statusOptions: Array
})

const emit = defineEmits(['reset'])
const { isDark } = useTheme()

function resetFilters() {
  emit('reset')
}
</script>
