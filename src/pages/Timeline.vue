<template>
  <div class="space-y-5 animate-fade-in">
    <!-- Page header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-bold"
          :class="isDark ? 'text-white' : 'text-gray-900'">
          Timeline
        </h1>
        <p class="text-sm mt-1"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          All transactions sorted by date
        </p>
      </div>

      <!-- Filter quick buttons -->
      <div class="flex items-center gap-2">
        <button
          v-for="f in filters"
          :key="f.value"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
          :class="activeFilter === f.value
            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
            : isDark
              ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Timeline content -->
    <SkeletonLoader v-if="store.loading" type="timeline" :rows="5" />
    <TransactionTimeline
      v-else
      :debts="filteredDebts"
      @open-person="openPerson"
    />

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
import TransactionTimeline from '@/components/timeline/TransactionTimeline.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import PersonModal from '@/components/person/PersonModal.vue'

const store = useDebtsStore()
const { isDark } = useTheme()

const activeFilter = ref('all')
const filters = [
  { value: 'all', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Returned', label: 'Returned' }
]

const filteredDebts = computed(() => {
  if (activeFilter.value === 'all') return store.processedDebts
  return store.processedDebts.filter((d) => d.status === activeFilter.value)
})

const showModal = ref(false)
const personStats = ref(null)

function openPerson(name) {
  personStats.value = store.getPersonStats(name)
  showModal.value = true
}
</script>
