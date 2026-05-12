<template>
  <!-- Overlay for mobile -->
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/60 md:hidden"
    @click="$emit('close')"
  />

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 h-full z-40 w-64 flex flex-col transition-transform duration-300 ease-in-out border-r"
    :class="[
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
      open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 h-16 px-5 border-b"
      :class="isDark ? 'border-gray-800' : 'border-gray-200'">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p class="font-bold text-base leading-none"
          :class="isDark ? 'text-white' : 'text-gray-900'">Toyana</p>
        <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Qarz kuzatuvchi</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="[
          $route.path === item.path || ($route.path.startsWith('/shaxs/') && item.path === '/')
            ? isDark
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
              : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
            : isDark
              ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        ]"
        @click="$emit('close')"
      >
        <span
          class="w-5 h-5 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          v-html="item.icon"
        />
        {{ item.name }}
        <span
          v-if="$route.path === item.path || ($route.path.startsWith('/shaxs/') && item.path === '/')"
          class="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
        />
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-4 border-t"
      :class="isDark ? 'border-gray-800' : 'border-gray-200'">
      <div class="flex items-center gap-2 text-xs"
        :class="isDark ? 'text-gray-600' : 'text-gray-400'">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Google Sheets orqali
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

defineProps({
  open: Boolean
})
defineEmits(['close'])

const { isDark } = useTheme()

const navItems = [
  {
    name: 'Odamlar',
    path: '/',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>`
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>`
  },
  {
    name: 'Qarzlar',
    path: '/qarzlar',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>`
  },
  {
    name: 'Tarix',
    path: '/tarix',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>`
  },
  {
    name: 'Tahlil',
    path: '/tahlil',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>`
  }
]
</script>
