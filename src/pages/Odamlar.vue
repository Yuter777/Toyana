<template>
  <div class="animate-fade-in">
    <!-- Sarlavha -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
        Odamlar
      </h1>
      <p class="text-sm mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
        Shaxsni tanlang — uning to'liq toy hisobi ko'rinadi
      </p>
    </div>

    <!-- Statistika bar (loading) -->
    <div v-if="store.loading" class="flex gap-3 mb-6">
      <div v-for="i in 3" :key="i" class="h-8 w-28 rounded-xl animate-pulse"
        :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" />
    </div>

    <!-- Statistika bar (loaded) -->
    <div v-else class="flex gap-3 mb-6 flex-wrap">
      <div class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
        :class="isDark ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-700'">
        <span class="w-2 h-2 rounded-full bg-indigo-500" />
        Jami {{ store.allPersonNames.length }} kishi
      </div>
      <div class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
        :class="isDark ? 'bg-gray-900 border-gray-800 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'">
        <span class="w-2 h-2 rounded-full bg-emerald-500" />
        {{ store.toyEgalar.length }} ta toy bo'ldi
      </div>
      <div class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
        :class="isDark ? 'bg-gray-900 border-gray-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'">
        <span class="w-2 h-2 rounded-full bg-amber-500" />
        {{ store.allPersonNames.length - store.toyEgalar.length }} ta hali to'y yo'q
      </div>
    </div>

    <!-- Qidiruv -->
    <div class="mb-6 relative max-w-md">
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="qidiruv"
        type="text"
        placeholder="Ism bo'yicha qidirish..."
        class="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-colors duration-200 outline-none focus:ring-2"
        :class="isDark
          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:ring-indigo-500/30 focus:border-indigo-500'
          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-indigo-500/30 focus:border-indigo-500'"
      />
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="i in 15" :key="i"
        class="rounded-2xl border p-5 animate-pulse"
        :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'"
      >
        <div class="w-14 h-14 rounded-2xl mb-3 mx-auto" :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" />
        <div class="h-4 rounded mb-2 mx-auto w-2/3" :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" />
        <div class="h-3 rounded mx-auto w-1/2" :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" />
      </div>
    </div>

    <!-- Bo'sh holat -->
    <div v-else-if="filteredPersons.length === 0" class="text-center py-20">
      <div class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
        <svg class="w-8 h-8" :class="isDark ? 'text-gray-600' : 'text-gray-400'"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p class="font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Hech kim topilmadi</p>
    </div>

    <!-- Odamlar kartochkalari -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <button
        v-for="shaxs in filteredPersons"
        :key="shaxs.name"
        class="rounded-2xl border p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
        :class="isDark
          ? 'bg-gray-900 border-gray-800 hover:border-indigo-500/40 hover:shadow-indigo-500/10'
          : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-indigo-100'"
        @click="shaxsOch(shaxs.name)"
      >
        <!-- Avatar -->
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold mb-3 mx-auto transition-all duration-200 group-hover:scale-110"
          :style="{ background: avatarRang(shaxs.name) }"
        >
          <span class="text-white">{{ shaxs.name.charAt(0).toUpperCase() }}</span>
        </div>

        <!-- Ism -->
        <p class="text-sm font-semibold text-center truncate mb-1"
          :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ shaxs.name }}
        </p>

        <!-- Toy holati badge -->
        <div class="flex justify-center mb-2">
          <span v-if="shaxs.toyi"
            class="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
            :class="isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Toyi bo'ldi
          </span>
          <span v-else
            class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="isDark ? 'bg-gray-700/60 text-gray-500' : 'bg-gray-100 text-gray-400'">
            Toyi yo'q
          </span>
        </div>

        <!-- Qisqa statistika -->
        <div class="space-y-1">
          <div v-if="shaxs.stats.totalLent > 0" class="flex items-center justify-between text-xs">
            <span :class="isDark ? 'text-gray-600' : 'text-gray-400'">Berdi</span>
            <span class="font-medium" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ formatQisqa(shaxs.stats.totalLent) }}
            </span>
          </div>
          <div v-if="shaxs.toyi && shaxs.stats.totalBorrowed > 0"
            class="flex items-center justify-between text-xs">
            <span :class="isDark ? 'text-gray-600' : 'text-gray-400'">Toyida oldi</span>
            <span class="font-medium" :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">
              {{ formatQisqa(shaxs.stats.totalBorrowed) }}
            </span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDebtsStore } from '@/stores/debtsStore'
import { useTheme } from '@/composables/useTheme'

const store = useDebtsStore()
const router = useRouter()
const { isDark } = useTheme()

const qidiruv = ref('')

const RANGLAR = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #10b981, #14b8a6)',
  'linear-gradient(135deg, #f59e0b, #f97316)',
  'linear-gradient(135deg, #ef4444, #ec4899)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #14b8a6, #10b981)',
]

function avatarRang(name) {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return RANGLAR[sum % RANGLAR.length]
}

const barcha = computed(() =>
  store.allPersonNames.map((name) => ({
    name,
    stats: store.getPersonStats(name),
    toyi: store.hasHadToy(name)
  }))
)

const filteredPersons = computed(() => {
  if (!qidiruv.value.trim()) return barcha.value
  const q = qidiruv.value.toLowerCase()
  return barcha.value.filter((s) => s.name.toLowerCase().includes(q))
})

function shaxsOch(name) {
  router.push(`/shaxs/${encodeURIComponent(name)}`)
}

function formatQisqa(val) {
  if (!val) return '$0'
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
  return `$${Math.round(val)}`
}
</script>
