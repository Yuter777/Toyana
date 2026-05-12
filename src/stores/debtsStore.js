import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchDebtsFromSheet } from '@/services/googleSheets'

function computeStatus(debt) {
  // Toy tizimi: har bir yozuv — boshqa birovning toyida berilgan sovg'a.
  // O'tgan toy = 'Returned' (ekranda "Berildi"), kelajakdagi = 'Pending'.
  const eventDate = new Date(debt.created_at)
  return eventDate <= new Date() ? 'Returned' : 'Pending'
}

export const useDebtsStore = defineStore('debts', () => {
  const debts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)

  const processedDebts = computed(() =>
    debts.value.map((d) => ({
      ...d,
      remaining: Math.max(0, d.amount - d.returned_amount),
      status: computeStatus(d)
    }))
  )

  const totalBorrowed = computed(() =>
    processedDebts.value.reduce((sum, d) => sum + d.amount, 0)
  )

  const totalReturned = computed(() =>
    processedDebts.value.reduce((sum, d) => sum + d.returned_amount, 0)
  )

  const totalRemaining = computed(() =>
    processedDebts.value.reduce((sum, d) => sum + d.remaining, 0)
  )

  const activeDebtsCount = computed(
    () => processedDebts.value.filter((d) => d.status !== 'Returned').length
  )

  function debtsByPerson(name) {
    return processedDebts.value.filter(
      (d) =>
        d.giver_name.toLowerCase() === name.toLowerCase() ||
        d.receiver_name.toLowerCase() === name.toLowerCase()
    )
  }

  function getPersonStats(name) {
    const lower = name.toLowerCase()
    const asGiver = processedDebts.value.filter(
      (d) => d.giver_name.toLowerCase() === lower
    )
    const asReceiver = processedDebts.value.filter(
      (d) => d.receiver_name.toLowerCase() === lower
    )

    const totalLent = asGiver.reduce((s, d) => s + d.amount, 0)
    const totalLentReturned = asGiver.reduce((s, d) => s + d.returned_amount, 0)
    const totalLentRemaining = asGiver.reduce((s, d) => s + d.remaining, 0)

    const totalBorrowed = asReceiver.reduce((s, d) => s + d.amount, 0)
    const totalBorrowedReturned = asReceiver.reduce((s, d) => s + d.returned_amount, 0)
    const totalBorrowedRemaining = asReceiver.reduce((s, d) => s + d.remaining, 0)

    const netBalance = totalLentRemaining - totalBorrowedRemaining

    return {
      name,
      asGiver,
      asReceiver,
      totalLent,
      totalLentReturned,
      totalLentRemaining,
      totalBorrowed,
      totalBorrowedReturned,
      totalBorrowedRemaining,
      netBalance,
      allDebts: [...asGiver, ...asReceiver].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
    }
  }

  const allPersonNames = computed(() => {
    const names = new Set()
    processedDebts.value.forEach((d) => {
      names.add(d.giver_name)
      names.add(d.receiver_name)
    })
    return [...names].sort()
  })

  // Toy o'tkazgan odamlar (receiver sifatida yozuvlari bor)
  const toyEgalar = computed(() => {
    const map = {}
    processedDebts.value.forEach((d) => {
      if (!map[d.receiver_name]) {
        map[d.receiver_name] = { name: d.receiver_name, date: d.created_at, jami: 0 }
      }
      map[d.receiver_name].jami += d.amount
    })
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  function hasHadToy(name) {
    return processedDebts.value.some(
      (d) => d.receiver_name.toLowerCase() === name.toLowerCase()
    )
  }

  function getToyInfo(name) {
    const lower = name.toLowerCase()
    const event = toyEgalar.value.find((e) => e.name.toLowerCase() === lower)
    return event || null
  }

  const topBorrowers = computed(() => {
    const map = {}
    processedDebts.value.forEach((d) => {
      if (!map[d.receiver_name]) map[d.receiver_name] = 0
      map[d.receiver_name] += d.amount
    })
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  })

  const topLenders = computed(() => {
    const map = {}
    processedDebts.value.forEach((d) => {
      if (!map[d.giver_name]) map[d.giver_name] = 0
      map[d.giver_name] += d.amount
    })
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  })

  const statusCounts = computed(() => {
    const counts = { Pending: 0, Partial: 0, Returned: 0, Overdue: 0 }
    processedDebts.value.forEach((d) => {
      counts[d.status] = (counts[d.status] || 0) + 1
    })
    return counts
  })

  async function fetchDebts() {
    loading.value = true
    error.value = null
    try {
      const data = await fetchDebtsFromSheet()
      debts.value = data
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Fon rejimida yangilash — loading spinner ko'rsatmaydi
  async function silentRefresh() {
    try {
      const data = await fetchDebtsFromSheet()
      debts.value = data
      lastUpdated.value = new Date()
    } catch {
      // Fon xatolarini e'tiborsiz qoldiramiz
    }
  }

  async function refreshDebts() {
    await fetchDebts()
  }

  return {
    debts,
    loading,
    error,
    lastUpdated,
    processedDebts,
    totalBorrowed,
    totalReturned,
    totalRemaining,
    activeDebtsCount,
    allPersonNames,
    topBorrowers,
    topLenders,
    statusCounts,
    debtsByPerson,
    getPersonStats,
    toyEgalar,
    hasHadToy,
    getToyInfo,
    fetchDebts,
    silentRefresh,
    refreshDebts
  }
})
