<template>
  <div class="relative">
    <!-- Timeline items -->
    <div
      v-for="(debt, index) in sortedDebts"
      :key="debt.id"
      class="flex gap-4 animate-slide-up"
      :style="{ animationDelay: `${index * 40}ms` }"
    >
      <!-- Left: connector -->
      <div class="flex flex-col items-center">
        <!-- Status dot -->
        <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200"
          :class="dotClass(debt.status)">
          <span v-html="statusIcon(debt.status)" class="w-4 h-4 block" />
        </div>
        <!-- Vertical line -->
        <div v-if="index < sortedDebts.length - 1"
          class="w-px flex-1 mt-1 mb-1 min-h-[32px]"
          :class="isDark ? 'bg-gray-800' : 'bg-gray-200'" />
      </div>

      <!-- Right: content -->
      <div class="flex-1 pb-6">
        <!-- Date header -->
        <p class="text-xs font-medium mb-2 -mt-0.5"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          {{ formatDate(debt.created_at) }}
        </p>

        <!-- Card -->
        <div class="rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
          :class="isDark
            ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-gray-100'">

          <!-- Header -->
          <div class="flex items-center justify-between gap-2 flex-wrap mb-3">
            <div class="flex items-center gap-2 text-sm">
              <button
                class="font-semibold transition-colors duration-150"
                :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'"
                @click="$emit('open-person', debt.giver_name)"
              >
                {{ debt.giver_name }}
              </button>
              <span :class="isDark ? 'text-gray-600' : 'text-gray-300'">
                <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <button
                class="font-semibold transition-colors duration-150"
                :class="isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'"
                @click="$emit('open-person', debt.receiver_name)"
              >
                {{ debt.receiver_name }}
              </button>
            </div>
            <StatusBadge :status="debt.status" />
          </div>

          <!-- Amounts -->
          <div class="flex items-center gap-4 flex-wrap">
            <div>
              <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Amount</p>
              <p class="text-base font-bold"
                :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ formatCurrency(debt.amount) }}
              </p>
            </div>

            <div v-if="debt.returned_amount > 0">
              <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Returned</p>
              <p class="text-base font-semibold"
                :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">
                {{ formatCurrency(debt.returned_amount) }}
                <span v-if="debt.returned_at" class="text-xs font-normal ml-1"
                  :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                  on {{ formatDate(debt.returned_at) }}
                </span>
              </p>
            </div>

            <div v-if="debt.remaining > 0">
              <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Remaining</p>
              <p class="text-base font-semibold"
                :class="isDark ? 'text-red-400' : 'text-red-500'">
                {{ formatCurrency(debt.remaining) }}
              </p>
            </div>
          </div>

          <!-- Progress bar -->
          <div v-if="debt.amount > 0" class="mt-3">
            <div class="h-1.5 rounded-full overflow-hidden"
              :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="progressBarColor(debt.status)"
                :style="{ width: `${Math.min(100, (debt.returned_amount / debt.amount) * 100)}%` }"
              />
            </div>
          </div>

          <!-- Note -->
          <p v-if="debt.note" class="text-xs mt-2.5 italic"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'">
            "{{ debt.note }}"
          </p>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <EmptyState
      v-if="sortedDebts.length === 0"
      type="debts"
      title="No transactions"
      description="There are no transactions to display in the timeline."
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps({
  debts: {
    type: Array,
    default: () => []
  }
})

defineEmits(['open-person'])
const { isDark } = useTheme()

const sortedDebts = computed(() =>
  [...props.debts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
)

function dotClass(status) {
  const map = {
    Pending: isDark.value
      ? 'bg-red-500/15 border-red-500/50 text-red-400'
      : 'bg-red-50 border-red-400 text-red-500',
    Partial: isDark.value
      ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
      : 'bg-amber-50 border-amber-400 text-amber-500',
    Returned: isDark.value
      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
      : 'bg-emerald-50 border-emerald-400 text-emerald-500',
    Overdue: isDark.value
      ? 'bg-red-600/20 border-red-600/60 text-red-300'
      : 'bg-red-50 border-red-500 text-red-600'
  }
  return map[status] || map.Pending
}

function statusIcon(status) {
  const icons = {
    Pending: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
    Partial: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>`,
    Returned: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
    Overdue: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>`
  }
  return icons[status] || icons.Pending
}

function progressBarColor(status) {
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
</script>
