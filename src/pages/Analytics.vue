<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold"
        :class="isDark ? 'text-white' : 'text-gray-900'">
        Analytics
      </h1>
      <p class="text-sm mt-1"
        :class="isDark ? 'text-gray-500' : 'text-gray-400'">
        Visual breakdown of debt activity
      </p>
    </div>

    <!-- Summary row -->
    <SkeletonLoader v-if="store.loading" type="stats" />
    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="rounded-xl border p-4 text-center"
        :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <p class="text-xs uppercase tracking-wide font-medium mb-1"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          Total Persons
        </p>
        <p class="text-3xl font-bold"
          :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ store.allPersonNames.length }}
        </p>
      </div>
      <div class="rounded-xl border p-4 text-center"
        :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <p class="text-xs uppercase tracking-wide font-medium mb-1"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          Avg Debt Size
        </p>
        <p class="text-3xl font-bold"
          :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ formatCurrency(avgDebtSize) }}
        </p>
      </div>
      <div class="rounded-xl border p-4 text-center"
        :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <p class="text-xs uppercase tracking-wide font-medium mb-1"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          Recovery Rate
        </p>
        <p class="text-3xl font-bold"
          :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ recoveryRate }}%
        </p>
      </div>
    </div>

    <!-- Charts -->
    <SkeletonLoader v-if="store.loading" type="card" class="h-96" />
    <DebtCharts
      v-else
      :totalReturned="store.totalReturned"
      :totalRemaining="store.totalRemaining"
      :statusCounts="store.statusCounts"
      :topBorrowers="store.topBorrowers"
      :topLenders="store.topLenders"
    />

    <!-- People table -->
    <div class="rounded-xl border transition-colors duration-200"
      :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="px-5 py-4 border-b"
        :class="isDark ? 'border-gray-800' : 'border-gray-200'">
        <h2 class="text-sm font-semibold"
          :class="isDark ? 'text-gray-200' : 'text-gray-800'">
          Person Summary
        </h2>
        <p class="text-xs mt-0.5"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          Click any name to view full details
        </p>
      </div>

      <SkeletonLoader v-if="store.loading" type="table" :rows="6" />
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b text-left"
              :class="isDark ? 'border-gray-800' : 'border-gray-200'">
              <th v-for="col in personCols" :key="col"
                class="px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y"
            :class="isDark ? 'divide-gray-800' : 'divide-gray-100'">
            <tr v-for="person in peopleStats" :key="person.name"
              class="transition-colors duration-150"
              :class="isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'">
              <td class="px-4 py-3">
                <button
                  class="flex items-center gap-2 text-sm font-medium transition-colors duration-150"
                  :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'"
                  @click="openPerson(person.name)"
                >
                  <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    :class="isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'">
                    {{ person.name.charAt(0) }}
                  </span>
                  {{ person.name }}
                </button>
              </td>
              <td class="px-4 py-3 text-sm font-medium"
                :class="isDark ? 'text-blue-400' : 'text-blue-600'">
                {{ formatCurrency(person.totalLent) }}
              </td>
              <td class="px-4 py-3 text-sm font-medium"
                :class="isDark ? 'text-red-400' : 'text-red-600'">
                {{ formatCurrency(person.totalBorrowed) }}
              </td>
              <td class="px-4 py-3 text-sm font-semibold"
                :class="person.netBalance >= 0
                  ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                  : isDark ? 'text-red-400' : 'text-red-600'">
                {{ person.netBalance >= 0 ? '+' : '' }}{{ formatCurrency(person.netBalance) }}
              </td>
              <td class="px-4 py-3 text-sm"
                :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                {{ person.allDebts.length }}
              </td>
            </tr>
          </tbody>
        </table>
        <EmptyState
          v-if="peopleStats.length === 0"
          type="chart"
          title="No data available"
          description="Load debt data to see analytics."
        />
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
import DebtCharts from '@/components/charts/DebtCharts.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PersonModal from '@/components/person/PersonModal.vue'

const store = useDebtsStore()
const { isDark } = useTheme()

const showModal = ref(false)
const personStats = ref(null)

const personCols = ['Person', 'Total Lent', 'Total Borrowed', 'Net Balance', 'Transactions']

const peopleStats = computed(() =>
  store.allPersonNames.map((name) => store.getPersonStats(name))
    .sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance))
)

const avgDebtSize = computed(() => {
  const count = store.processedDebts.length
  return count ? store.totalBorrowed / count : 0
})

const recoveryRate = computed(() => {
  if (!store.totalBorrowed) return 0
  return Math.round((store.totalReturned / store.totalBorrowed) * 100)
})

function openPerson(name) {
  personStats.value = store.getPersonStats(name)
  showModal.value = true
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val || 0)
}
</script>
