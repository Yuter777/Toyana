<template>
  <div class="min-h-screen transition-colors duration-200"
    :class="isDark ? 'bg-gray-950' : 'bg-gray-50'">

    <!-- Sidebar -->
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main layout -->
    <div class="md:pl-64 flex flex-col min-h-screen">
      <!-- Header -->
      <AppHeader
        :loading="store.loading"
        :lastUpdated="store.lastUpdated"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @refresh="handleRefresh"
      />

      <!-- Page content -->
      <main class="flex-1 px-4 md:px-6 py-6">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Toast notifications -->
    <ToastNotification />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDebtsStore } from '@/stores/debtsStore'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

const store = useDebtsStore()
const { isDark, initTheme } = useTheme()
const { success, error: toastError, info } = useToast()

const sidebarOpen = ref(false)

const YANGILASH_INTERVAL = 5 * 60 * 1000 // 5 daqiqa
let intervalId = null

onUnmounted(() => {
  clearInterval(intervalId)
})

async function handleRefresh() {
  info('Refreshing data...')
  await store.refreshDebts()
  if (store.error) {
    toastError('Failed to fetch live data. Using cached/sample data.')
  } else {
    success(`Loaded ${store.processedDebts.length} records successfully.`)
  }
}

onMounted(async () => {
  initTheme()
  await store.fetchDebts()
  if (store.error) {
    toastError('Google Sheets ga ulanib bo\'lmadi. Namunali ma\'lumotlar yuklandi.')
  } else {
    success(`${store.processedDebts.length} ta yozuv yuklandi.`)
  }

  // Har 5 daqiqada fon rejimida yangilash
  intervalId = setInterval(async () => {
    await store.silentRefresh()
  }, YANGILASH_INTERVAL)
})
</script>
