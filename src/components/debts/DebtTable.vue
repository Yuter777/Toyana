<template>
  <div class="rounded-xl border overflow-hidden transition-colors duration-200"
    :class="isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'">

    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b text-left"
            :class="isDark ? 'bg-gray-850 border-gray-800' : 'bg-gray-50 border-gray-200'">
            <th v-for="col in columns" :key="col.key"
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none transition-colors duration-150"
              :class="[
                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700',
                col.sortable ? 'hover:cursor-pointer' : 'cursor-default'
              ]"
              @click="col.sortable && setSort(col.key)"
            >
              <div class="flex items-center gap-1.5">
                {{ col.label }}
                <template v-if="col.sortable">
                  <svg v-if="sortKey === col.key" class="w-3.5 h-3.5"
                    :class="isDark ? 'text-indigo-400' : 'text-indigo-500'"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      :d="sortDir === 'asc'
                        ? 'M5 15l7-7 7 7'
                        : 'M19 9l-7 7-7-7'" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </template>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y" :class="isDark ? 'divide-gray-800' : 'divide-gray-100'">
          <tr
            v-for="debt in debts"
            :key="debt.id"
            class="transition-colors duration-150 group"
            :class="isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'"
          >
            <!-- Giver -->
            <td class="px-4 py-3">
              <button
                class="text-sm font-medium transition-colors duration-150"
                :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'"
                @click="$emit('open-person', debt.giver_name)"
              >
                {{ debt.giver_name }}
              </button>
            </td>

            <!-- Receiver -->
            <td class="px-4 py-3">
              <button
                class="text-sm font-medium transition-colors duration-150"
                :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'"
                @click="$emit('open-person', debt.receiver_name)"
              >
                {{ debt.receiver_name }}
              </button>
            </td>

            <!-- Amount -->
            <td class="px-4 py-3">
              <span class="text-sm font-semibold"
                :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ formatCurrency(debt.amount) }}
              </span>
            </td>

            <!-- Returned -->
            <td class="px-4 py-3">
              <span class="text-sm font-medium"
                :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">
                {{ formatCurrency(debt.returned_amount) }}
              </span>
            </td>

            <!-- Remaining -->
            <td class="px-4 py-3">
              <span class="text-sm font-medium"
                :class="debt.remaining > 0
                  ? isDark ? 'text-red-400' : 'text-red-500'
                  : isDark ? 'text-gray-500' : 'text-gray-400'">
                {{ formatCurrency(debt.remaining) }}
              </span>
            </td>

            <!-- Status -->
            <td class="px-4 py-3">
              <StatusBadge :status="debt.status" />
            </td>

            <!-- Date -->
            <td class="px-4 py-3">
              <span class="text-xs"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                {{ formatDate(debt.created_at) }}
              </span>
            </td>

            <!-- Note -->
            <td class="px-4 py-3 max-w-[180px]">
              <span class="text-xs truncate block"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                :title="debt.note">
                {{ debt.note || '—' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden divide-y" :class="isDark ? 'divide-gray-800' : 'divide-gray-100'">
      <div
        v-for="debt in debts"
        :key="debt.id"
        class="px-4 py-4 transition-colors duration-150"
        :class="isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="flex items-center gap-1.5 text-sm">
              <button
                class="font-semibold"
                :class="isDark ? 'text-indigo-400' : 'text-indigo-600'"
                @click="$emit('open-person', debt.giver_name)">
                {{ debt.giver_name }}
              </button>
              <svg class="w-3.5 h-3.5"
                :class="isDark ? 'text-gray-600' : 'text-gray-300'"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <button
                class="font-semibold"
                :class="isDark ? 'text-indigo-400' : 'text-indigo-600'"
                @click="$emit('open-person', debt.receiver_name)">
                {{ debt.receiver_name }}
              </button>
            </div>
            <p class="text-xs mt-0.5"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              {{ formatDate(debt.created_at) }}
            </p>
          </div>
          <StatusBadge :status="debt.status" />
        </div>

        <div class="grid grid-cols-3 gap-2 mt-3">
          <div>
            <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Amount</p>
            <p class="text-sm font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ formatCurrency(debt.amount) }}
            </p>
          </div>
          <div>
            <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Returned</p>
            <p class="text-sm font-medium"
              :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">
              {{ formatCurrency(debt.returned_amount) }}
            </p>
          </div>
          <div>
            <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Remaining</p>
            <p class="text-sm font-medium"
              :class="debt.remaining > 0
                ? isDark ? 'text-red-400' : 'text-red-500'
                : isDark ? 'text-gray-500' : 'text-gray-400'">
              {{ formatCurrency(debt.remaining) }}
            </p>
          </div>
        </div>

        <p v-if="debt.note" class="text-xs mt-2 italic"
          :class="isDark ? 'text-gray-600' : 'text-gray-400'">
          "{{ debt.note }}"
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <EmptyState
      v-if="debts.length === 0"
      type="search"
      title="No debts found"
      description="Try adjusting your search or filter to find what you're looking for."
    />
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps({
  debts: {
    type: Array,
    default: () => []
  },
  sortKey: String,
  sortDir: String
})

const emit = defineEmits(['set-sort', 'open-person'])
const { isDark } = useTheme()

const columns = [
  { key: 'giver_name', label: 'Giver', sortable: true },
  { key: 'receiver_name', label: 'Receiver', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'returned_amount', label: 'Returned', sortable: true },
  { key: 'remaining', label: 'Remaining', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Date', sortable: true },
  { key: 'note', label: 'Note', sortable: false }
]

function setSort(key) {
  emit('set-sort', key)
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
</script>
