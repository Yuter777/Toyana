<template>
  <div class="space-y-5 animate-fade-in">
    <!-- Page header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-bold"
          :class="isDark ? 'text-white' : 'text-gray-900'">
          Debts
        </h1>
        <p class="text-sm mt-1"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          <template v-if="!store.loading">
            {{ filtered.length }} of {{ store.processedDebts.length }} records
          </template>
          <template v-else>Loading...</template>
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-xl border p-4 transition-colors duration-200"
      :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <DebtFilters
        v-model:searchQuery="searchQuery"
        v-model:statusFilter="statusFilter"
        v-model:unpaidOnly="unpaidOnly"
        :statusOptions="statusOptions"
        @reset="resetFilters"
      />
    </div>

    <!-- Table -->
    <SkeletonLoader v-if="store.loading" type="table" :rows="8" />
    <DebtTable
      v-else
      :debts="filtered"
      :sortKey="sortKey"
      :sortDir="sortDir"
      @set-sort="setSort"
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
import DebtFilters from '@/components/debts/DebtFilters.vue'
import DebtTable from '@/components/debts/DebtTable.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import PersonModal from '@/components/person/PersonModal.vue'

const store = useDebtsStore()
const { isDark } = useTheme()

const searchQuery = ref('')
const statusFilter = ref('All')
const unpaidOnly = ref(false)
const sortKey = ref('created_at')
const sortDir = ref('desc')

const statusOptions = ['All', 'Pending', 'Partial', 'Returned', 'Overdue']

const filtered = computed(() => {
  let list = store.processedDebts

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (d) =>
        d.giver_name.toLowerCase().includes(q) ||
        d.receiver_name.toLowerCase().includes(q) ||
        (d.note && d.note.toLowerCase().includes(q))
    )
  }

  if (statusFilter.value !== 'All') {
    list = list.filter((d) => d.status === statusFilter.value)
  }

  if (unpaidOnly.value) {
    list = list.filter((d) => d.status !== 'Returned')
  }

  list = [...list].sort((a, b) => {
    let av = a[sortKey.value]
    let bv = b[sortKey.value]
    if (typeof av === 'string') {
      av = av.toLowerCase()
      bv = bv.toLowerCase()
    }
    if (av < bv) return sortDir.value === 'asc' ? -1 : 1
    if (av > bv) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

function setSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'desc'
  }
}

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = 'All'
  unpaidOnly.value = false
}

const showModal = ref(false)
const personStats = ref(null)

function openPerson(name) {
  personStats.value = store.getPersonStats(name)
  showModal.value = true
}
</script>
