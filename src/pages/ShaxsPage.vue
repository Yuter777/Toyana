<template>
  <div class="animate-fade-in max-w-2xl mx-auto">

    <!-- Orqaga -->
    <button
      class="flex items-center gap-2 text-sm font-medium mb-6 transition-colors duration-150"
      :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'"
      @click="router.back()"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Orqaga
    </button>

    <!-- Odam topilmadi -->
    <div v-if="!stats" class="text-center py-20">
      <p class="text-lg font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        Odam topilmadi
      </p>
    </div>

    <template v-else>
      <!-- Shaxs sarlavhasi -->
      <div class="rounded-2xl border p-5 mb-5 transition-colors duration-200"
        :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            :style="{ background: avatarRang(stats.name) }"
          >
            <span class="text-white">{{ stats.name.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ stats.name }}
            </h1>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <!-- Toy holati -->
              <span v-if="toyInfo" class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                :class="isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-700'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Toyi bo'ldi · {{ formatSana(toyInfo.date) }}
              </span>
              <span v-else class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                :class="isDark ? 'bg-gray-700/60 text-gray-400' : 'bg-gray-100 text-gray-500'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hali toyi yo'q
              </span>
              <span class="text-xs" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                · {{ stats.allDebts.length }} tranzaksiya
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4 ta statistika kartochkasi -->
      <div class="grid grid-cols-2 gap-3 mb-5">

        <!-- Boshqalarga berdi -->
        <div class="rounded-2xl border p-4 transition-colors duration-200"
          :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center"
              :class="isDark ? 'bg-blue-500/15' : 'bg-blue-50'">
              <svg class="w-4 h-4" :class="isDark ? 'text-blue-400' : 'text-blue-600'"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              Boshqalarga berdi
            </span>
          </div>
          <p class="text-xl font-bold" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
            {{ formatSummaFull(stats.totalLent) }}
          </p>
          <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
            {{ stats.asGiver.length }} ta toyda
          </p>
        </div>

        <!-- O'z toyida oldi -->
        <div class="rounded-2xl border p-4 transition-colors duration-200"
          :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center"
              :class="toyInfo
                ? isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'
                : isDark ? 'bg-gray-800' : 'bg-gray-100'">
              <svg class="w-4 h-4"
                :class="toyInfo
                  ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                  : isDark ? 'text-gray-600' : 'text-gray-400'"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              O'z toyida oldi
            </span>
          </div>
          <p class="text-xl font-bold"
            :class="toyInfo
              ? isDark ? 'text-emerald-400' : 'text-emerald-600'
              : isDark ? 'text-gray-600' : 'text-gray-400'">
            {{ toyInfo ? formatSummaFull(stats.totalBorrowed) : '—' }}
          </p>
          <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
            {{ toyInfo ? `${stats.asReceiver.length} ta kishidan` : 'Toyi bo\'lmagan' }}
          </p>
        </div>

        <!-- Qatnashgan toylari -->
        <div class="rounded-2xl border p-4 transition-colors duration-200"
          :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center"
              :class="isDark ? 'bg-purple-500/15' : 'bg-purple-50'">
              <svg class="w-4 h-4" :class="isDark ? 'text-purple-400' : 'text-purple-600'"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              Qatnashdi
            </span>
          </div>
          <p class="text-xl font-bold" :class="isDark ? 'text-purple-400' : 'text-purple-600'">
            {{ stats.asGiver.length }}
            <span class="text-sm font-normal" :class="isDark ? 'text-gray-500' : 'text-gray-400'">toy</span>
          </p>
          <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
            o'rtacha {{ stats.asGiver.length > 0 ? formatSummaFull(Math.round(stats.totalLent / stats.asGiver.length)) : '$0' }}
          </p>
        </div>

        <!-- Sof hisobi -->
        <div class="rounded-2xl border p-4 transition-colors duration-200"
          :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center"
              :class="(stats.netBalance || 0) >= 0
                ? isDark ? 'bg-amber-500/15' : 'bg-amber-50'
                : isDark ? 'bg-red-500/15' : 'bg-red-50'">
              <svg class="w-4 h-4"
                :class="(stats.netBalance || 0) >= 0
                  ? isDark ? 'text-amber-400' : 'text-amber-600'
                  : isDark ? 'text-red-400' : 'text-red-600'"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              Sof hisobi
            </span>
          </div>
          <p class="text-xl font-bold"
            :class="(stats.netBalance || 0) >= 0
              ? isDark ? 'text-amber-400' : 'text-amber-600'
              : isDark ? 'text-red-400' : 'text-red-600'">
            {{ (stats.netBalance || 0) >= 0 ? '+' : '' }}{{ formatSummaFull(stats.netBalance) }}
          </p>
          <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
            {{ (stats.netBalance || 0) >= 0 ? 'Guruh qarzdor' : 'U ko\'proq olgan' }}
          </p>
        </div>
      </div>

      <!-- U bergan toylar ro'yxati -->
      <div v-if="stats.asGiver.length > 0" class="mb-5">
        <h3 class="text-xs font-semibold uppercase tracking-wider mb-3"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          U bergan toylar ({{ stats.asGiver.length }})
        </h3>
        <div class="space-y-2">
          <div
            v-for="q in stats.asGiver"
            :key="q.id"
            class="rounded-xl border p-4 transition-colors duration-200"
            :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-blue-50/40 border-blue-100'"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <!-- Giver → Receiver -->
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                    {{ stats.name }}
                  </span>
                  <svg class="w-3.5 h-3.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <button
                    class="text-sm font-semibold transition-colors duration-150"
                    :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'"
                    @click="boshqaShaxsOch(q.receiver_name)"
                  >
                    {{ q.receiver_name }}
                  </button>
                  <span class="text-xs" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                    toyi
                  </span>
                </div>
                <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ formatSana(q.created_at) }}
                </p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <p class="text-base font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ formatSummaFull(q.amount) }}
                </p>
                <StatusBadge :status="q.status" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Uning toyida berganlar ro'yxati -->
      <div v-if="stats.asReceiver.length > 0" class="mb-5">
        <h3 class="text-xs font-semibold uppercase tracking-wider mb-3"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          Uning toyida berganlar ({{ stats.asReceiver.length }})
        </h3>
        <div class="space-y-2">
          <div
            v-for="q in stats.asReceiver"
            :key="q.id"
            class="rounded-xl border p-4 transition-colors duration-200"
            :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-emerald-50/40 border-emerald-100'"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <button
                    class="text-sm font-semibold transition-colors duration-150"
                    :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'"
                    @click="boshqaShaxsOch(q.giver_name)"
                  >
                    {{ q.giver_name }}
                  </button>
                  <span class="text-xs" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                    berdi
                  </span>
                </div>
                <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ formatSana(q.created_at) }} · {{ stats.name }} toyi
                </p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <p class="text-base font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ formatSummaFull(q.amount) }}
                </p>
                <StatusBadge :status="q.status" />
              </div>
            </div>
          </div>
        </div>

        <!-- Toy jami -->
        <div class="mt-2 rounded-xl border px-4 py-3 flex items-center justify-between"
          :class="isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'">
          <span class="text-sm font-medium" :class="isDark ? 'text-emerald-400' : 'text-emerald-700'">
            Toy jami
          </span>
          <span class="text-base font-bold" :class="isDark ? 'text-emerald-400' : 'text-emerald-700'">
            {{ formatSummaFull(stats.totalBorrowed) }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebtsStore } from '@/stores/debtsStore'
import { useTheme } from '@/composables/useTheme'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const store = useDebtsStore()
const { isDark } = useTheme()

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

const ism = computed(() => decodeURIComponent(route.params.ism || ''))

const stats = computed(() => {
  if (!ism.value) return null
  const found = store.allPersonNames.find(
    (n) => n.toLowerCase() === ism.value.toLowerCase()
  )
  return found ? store.getPersonStats(found) : null
})

const toyInfo = computed(() =>
  stats.value ? store.getToyInfo(stats.value.name) : null
)

function boshqaShaxsOch(name) {
  router.push(`/shaxs/${encodeURIComponent(name)}`)
}

function formatSummaFull(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val || 0)
}

function formatSana(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return new Intl.DateTimeFormat('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d)
}
</script>
