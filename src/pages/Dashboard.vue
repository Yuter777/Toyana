<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold"
        :class="isDark ? 'text-white' : 'text-gray-900'">
        Dashboard
      </h1>
      <p class="text-sm mt-1"
        :class="isDark ? 'text-gray-500' : 'text-gray-400'">
        Overview of all debt activity
      </p>
    </div>

    <!-- Stat cards -->
    <SkeletonLoader v-if="store.loading" type="stats" />
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Total Borrowed"
        :value="store.totalBorrowed"
        subtitle="All time"
        variant="blue"
        :icon="icons.borrowed"
      />
      <StatCard
        label="Total Returned"
        :value="store.totalReturned"
        :subtitle="`${returnRate}% repayment rate`"
        variant="green"
        :icon="icons.returned"
      />
      <StatCard
        label="Total Remaining"
        :value="store.totalRemaining"
        subtitle="Still outstanding"
        variant="amber"
        :icon="icons.remaining"
      />
      <StatCard
        label="Active Debts"
        :value="store.activeDebtsCount"
        :subtitle="`${store.processedDebts.length} total records`"
        variant="red"
        :isCurrency="false"
        :icon="icons.active"
      />
    </div>

    <!-- Recent activity + Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent debts (latest 5) -->
      <div class="lg:col-span-2 rounded-xl border transition-colors duration-200"
        :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between px-5 py-4 border-b"
          :class="isDark ? 'border-gray-800' : 'border-gray-200'">
          <h2 class="text-sm font-semibold"
            :class="isDark ? 'text-gray-200' : 'text-gray-800'">
            Recent Activity
          </h2>
          <router-link
            to="/debts"
            class="text-xs font-medium transition-colors duration-150"
            :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'"
          >
            View all →
          </router-link>
        </div>

        <SkeletonLoader v-if="store.loading" type="table" :rows="5" class="p-4" />
        <div v-else-if="recentDebts.length === 0">
          <EmptyState type="debts" title="No debts yet" description="Data will appear here once loaded." />
        </div>
        <div v-else class="divide-y" :class="isDark ? 'divide-gray-800' : 'divide-gray-100'">
          <div
            v-for="debt in recentDebts"
            :key="debt.id"
            class="flex items-center gap-3 px-5 py-3 transition-colors duration-150 group"
            :class="isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'"
          >
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'">
              {{ debt.giver_name.charAt(0) }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 text-sm">
                <button
                  class="font-medium truncate"
                  :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                  @click="openPerson(debt.giver_name)">
                  {{ debt.giver_name }}
                </button>
                <svg class="w-3.5 h-3.5 flex-shrink-0"
                  :class="isDark ? 'text-gray-600' : 'text-gray-400'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <button
                  class="font-medium truncate"
                  :class="isDark ? 'text-gray-200' : 'text-gray-800'"
                  @click="openPerson(debt.receiver_name)">
                  {{ debt.receiver_name }}
                </button>
              </div>
              <p class="text-xs"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                {{ formatDate(debt.created_at) }}
              </p>
            </div>

            <div class="text-right flex-shrink-0">
              <p class="text-sm font-semibold"
                :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ formatCurrency(debt.amount) }}
              </p>
              <StatusBadge :status="debt.status" />
            </div>
          </div>
        </div>
      </div>

      <!-- Status summary -->
      <div class="space-y-4">
        <!-- Status breakdown -->
        <div class="rounded-xl border p-5 transition-colors duration-200"
          :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <h2 class="text-sm font-semibold mb-4"
            :class="isDark ? 'text-gray-200' : 'text-gray-800'">
            Status Breakdown
          </h2>
          <SkeletonLoader v-if="store.loading" type="default" :rows="4" />
          <div v-else class="space-y-3">
            <div
              v-for="(count, status) in store.statusCounts"
              :key="status"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full"
                  :class="statusDotColor(status)" />
                <span class="text-sm"
                  :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ status }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-20 h-1.5 rounded-full overflow-hidden"
                  :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="statusBarColor(status)"
                    :style="{
                      width: `${totalCount > 0 ? (count / totalCount) * 100 : 0}%`
                    }"
                  />
                </div>
                <span class="text-sm font-semibold w-5 text-right"
                  :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                  {{ count }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="rounded-xl border p-5 transition-colors duration-200"
          :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <h2 class="text-sm font-semibold mb-4"
            :class="isDark ? 'text-gray-200' : 'text-gray-800'">
            Repayment Progress
          </h2>
          <SkeletonLoader v-if="store.loading" type="card" />
          <div v-else>
            <div class="flex items-center justify-between text-xs mb-2">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                {{ formatCurrency(store.totalReturned) }} of {{ formatCurrency(store.totalBorrowed) }}
              </span>
              <span class="font-semibold"
                :class="isDark ? 'text-indigo-400' : 'text-indigo-600'">
                {{ returnRate }}%
              </span>
            </div>
            <div class="h-2 rounded-full overflow-hidden"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
              <div
                class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
                :style="{ width: `${returnRate}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Person Modal -->
    <PersonModal
      :show="showModal"
      :stats="personStats"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDebtsStore } from '@/stores/debtsStore'
import { useTheme } from '@/composables/useTheme'
import StatCard from '@/components/dashboard/StatCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PersonModal from '@/components/person/PersonModal.vue'

const store = useDebtsStore()
const { isDark } = useTheme()

const showModal = ref(false)
const personStats = ref(null)

const recentDebts = computed(() =>
  [...store.processedDebts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8)
)

const returnRate = computed(() => {
  if (!store.totalBorrowed) return 0
  return Math.round((store.totalReturned / store.totalBorrowed) * 100)
})

const totalCount = computed(() =>
  Object.values(store.statusCounts).reduce((s, c) => s + c, 0)
)

function openPerson(name) {
  personStats.value = store.getPersonStats(name)
  showModal.value = true
}

function statusDotColor(status) {
  const map = {
    Pending: 'bg-red-400',
    Partial: 'bg-amber-400',
    Returned: 'bg-emerald-400',
    Overdue: 'bg-red-600'
  }
  return map[status] || 'bg-gray-400'
}

function statusBarColor(status) {
  const map = {
    Pending: 'bg-red-500',
    Partial: 'bg-amber-500',
    Returned: 'bg-emerald-500',
    Overdue: 'bg-red-600'
  }
  return map[status] || 'bg-gray-500'
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d)
}

const icons = {
  borrowed: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  returned: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  remaining: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  active: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>`
}
</script>
