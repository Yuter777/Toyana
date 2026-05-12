import { ref, computed } from 'vue'

export function useFilters(debts) {
  const searchQuery = ref('')
  const statusFilter = ref('All')
  const unpaidOnly = ref(false)
  const sortKey = ref('created_at')
  const sortDir = ref('desc')

  const statusOptions = ['All', 'Pending', 'Partial', 'Returned', 'Overdue']

  const filtered = computed(() => {
    let list = debts.value

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

  return {
    searchQuery,
    statusFilter,
    unpaidOnly,
    sortKey,
    sortDir,
    statusOptions,
    filtered,
    setSort,
    resetFilters
  }
}
