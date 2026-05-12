<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')" />

        <!-- Modal -->
        <div
          class="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col animate-slide-up"
          :class="isDark
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
            :class="isDark ? 'border-gray-800' : 'border-gray-200'">
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                :class="isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'">
                {{ stats?.name?.charAt(0)?.toUpperCase() }}
              </div>
              <div>
                <h2 class="text-base font-bold"
                  :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ stats?.name }}
                </h2>
                <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ stats?.allDebts?.length || 0 }} transaction{{ stats?.allDebts?.length !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
            <button
              class="p-2 rounded-lg transition-colors duration-200"
              :class="isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'"
              @click="$emit('close')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable content -->
          <div class="overflow-y-auto flex-1 px-6 py-4 space-y-5">
            <!-- Summary stats -->
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-xl p-3 text-center border"
                :class="isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'">
                <p class="text-xs mb-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  Total Lent
                </p>
                <p class="text-sm font-bold"
                  :class="isDark ? 'text-blue-400' : 'text-blue-600'">
                  {{ formatCurrency(stats?.totalLent) }}
                </p>
                <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                  {{ formatCurrency(stats?.totalLentRemaining) }} left
                </p>
              </div>

              <div class="rounded-xl p-3 text-center border"
                :class="isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'">
                <p class="text-xs mb-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  Total Borrowed
                </p>
                <p class="text-sm font-bold"
                  :class="isDark ? 'text-red-400' : 'text-red-600'">
                  {{ formatCurrency(stats?.totalBorrowed) }}
                </p>
                <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                  {{ formatCurrency(stats?.totalBorrowedRemaining) }} left
                </p>
              </div>

              <div class="rounded-xl p-3 text-center border"
                :class="[
                  isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200',
                ]">
                <p class="text-xs mb-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  Net Balance
                </p>
                <p class="text-sm font-bold"
                  :class="(stats?.netBalance || 0) >= 0
                    ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                    : isDark ? 'text-red-400' : 'text-red-600'">
                  {{ (stats?.netBalance || 0) >= 0 ? '+' : '' }}{{ formatCurrency(stats?.netBalance) }}
                </p>
                <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
                  {{ (stats?.netBalance || 0) >= 0 ? 'owed to them' : 'they owe' }}
                </p>
              </div>
            </div>

            <!-- As Giver -->
            <div v-if="stats?.asGiver?.length">
              <h4 class="text-xs font-semibold uppercase tracking-wider mb-2"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                Money Lent Out ({{ stats.asGiver.length }})
              </h4>
              <div class="space-y-2">
                <div
                  v-for="debt in stats.asGiver"
                  :key="debt.id"
                  class="flex items-center justify-between rounded-xl p-3 border"
                  :class="isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50/50 border-blue-100'"
                >
                  <div>
                    <p class="text-sm font-medium"
                      :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                      To {{ debt.receiver_name }}
                    </p>
                    <p class="text-xs"
                      :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                      {{ formatDate(debt.created_at) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <p class="text-sm font-semibold"
                        :class="isDark ? 'text-white' : 'text-gray-900'">
                        {{ formatCurrency(debt.amount) }}
                      </p>
                      <p v-if="debt.remaining > 0" class="text-xs"
                        :class="isDark ? 'text-red-400' : 'text-red-500'">
                        -{{ formatCurrency(debt.remaining) }}
                      </p>
                    </div>
                    <StatusBadge :status="debt.status" />
                  </div>
                </div>
              </div>
            </div>

            <!-- As Receiver -->
            <div v-if="stats?.asReceiver?.length">
              <h4 class="text-xs font-semibold uppercase tracking-wider mb-2"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                Money Borrowed ({{ stats.asReceiver.length }})
              </h4>
              <div class="space-y-2">
                <div
                  v-for="debt in stats.asReceiver"
                  :key="debt.id"
                  class="flex items-center justify-between rounded-xl p-3 border"
                  :class="isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-red-50/50 border-red-100'"
                >
                  <div>
                    <p class="text-sm font-medium"
                      :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                      From {{ debt.giver_name }}
                    </p>
                    <p class="text-xs"
                      :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                      {{ formatDate(debt.created_at) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <p class="text-sm font-semibold"
                        :class="isDark ? 'text-white' : 'text-gray-900'">
                        {{ formatCurrency(debt.amount) }}
                      </p>
                      <p v-if="debt.remaining > 0" class="text-xs"
                        :class="isDark ? 'text-red-400' : 'text-red-500'">
                        -{{ formatCurrency(debt.remaining) }}
                      </p>
                    </div>
                    <StatusBadge :status="debt.status" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import StatusBadge from '@/components/ui/StatusBadge.vue'

defineProps({
  show: Boolean,
  stats: Object
})

defineEmits(['close'])
const { isDark } = useTheme()

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

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .animate-slide-up,
.modal-leave-to .animate-slide-up {
  transform: scale(0.95) translateY(8px);
}
</style>
