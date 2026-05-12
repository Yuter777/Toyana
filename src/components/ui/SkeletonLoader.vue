<template>
  <div class="animate-pulse" :class="className">
    <!-- Stat cards skeleton -->
    <template v-if="type === 'stats'">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="rounded-xl p-5 h-28"
          :class="isDark ? 'bg-gray-800' : 'bg-gray-200'">
          <div class="h-3 rounded w-1/2 mb-3"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'" />
          <div class="h-7 rounded w-3/4 mb-2"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'" />
          <div class="h-2.5 rounded w-1/3"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'" />
        </div>
      </div>
    </template>

    <!-- Table skeleton -->
    <template v-else-if="type === 'table'">
      <div class="rounded-xl overflow-hidden border"
        :class="isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'">
        <div class="h-12 border-b"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'" />
        <div class="divide-y" :class="isDark ? 'divide-gray-800' : 'divide-gray-100'">
          <div v-for="i in rows" :key="i" class="flex items-center gap-4 px-4 py-3">
            <div class="h-4 rounded flex-1"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" />
            <div class="h-4 rounded w-20"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" />
            <div class="h-4 rounded w-16"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" />
            <div class="h-6 rounded-full w-20"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" />
          </div>
        </div>
      </div>
    </template>

    <!-- Card skeleton -->
    <template v-else-if="type === 'card'">
      <div class="rounded-xl p-5"
        :class="isDark ? 'bg-gray-800' : 'bg-gray-200'">
        <div class="h-4 rounded w-1/3 mb-4"
          :class="isDark ? 'bg-gray-700' : 'bg-gray-300'" />
        <div class="space-y-2">
          <div class="h-3 rounded"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'" />
          <div class="h-3 rounded w-4/5"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'" />
          <div class="h-3 rounded w-3/5"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'" />
        </div>
      </div>
    </template>

    <!-- Timeline skeleton -->
    <template v-else-if="type === 'timeline'">
      <div class="space-y-6">
        <div v-for="i in rows" :key="i" class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-200'" />
            <div class="w-px flex-1 mt-2"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-200'" />
          </div>
          <div class="flex-1 pb-6">
            <div class="h-4 rounded w-1/3 mb-2"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-200'" />
            <div class="rounded-xl p-4"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
              <div class="h-3 rounded w-3/4 mb-2"
                :class="isDark ? 'bg-gray-700' : 'bg-gray-200'" />
              <div class="h-3 rounded w-1/2"
                :class="isDark ? 'bg-gray-700' : 'bg-gray-200'" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Default line skeleton -->
    <template v-else>
      <div class="space-y-2">
        <div v-for="i in rows" :key="i"
          class="h-4 rounded"
          :class="[isDark ? 'bg-gray-800' : 'bg-gray-200', i % 3 === 0 ? 'w-3/4' : 'w-full']"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

defineProps({
  type: {
    type: String,
    default: 'default'
  },
  rows: {
    type: Number,
    default: 5
  },
  className: {
    type: String,
    default: ''
  }
})

const { isDark } = useTheme()
</script>
