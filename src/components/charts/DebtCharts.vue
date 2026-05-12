<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Doughnut: Returned vs Remaining -->
    <div class="rounded-xl border p-5 transition-colors duration-200"
      :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <h3 class="text-sm font-semibold mb-4"
        :class="isDark ? 'text-gray-200' : 'text-gray-800'">
        Returned vs Remaining
      </h3>
      <div class="flex justify-center">
        <div style="width: 240px; height: 240px;">
          <Doughnut
            v-if="doughnutData.labels.length"
            :data="doughnutData"
            :options="doughnutOptions"
          />
        </div>
      </div>
      <!-- Legend -->
      <div class="flex items-center justify-center gap-5 mt-4">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500" />
          <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Returned {{ formatCurrency(totalReturned) }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500" />
          <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Remaining {{ formatCurrency(totalRemaining) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Bar: Status distribution -->
    <div class="rounded-xl border p-5 transition-colors duration-200"
      :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <h3 class="text-sm font-semibold mb-4"
        :class="isDark ? 'text-gray-200' : 'text-gray-800'">
        Status Distribution
      </h3>
      <div style="height: 220px;">
        <Bar
          v-if="statusBarData.labels.length"
          :data="statusBarData"
          :options="barOptions"
        />
      </div>
    </div>

    <!-- Top 5 Borrowers -->
    <div class="rounded-xl border p-5 transition-colors duration-200"
      :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <h3 class="text-sm font-semibold mb-4"
        :class="isDark ? 'text-gray-200' : 'text-gray-800'">
        Top Borrowers
      </h3>
      <div style="height: 220px;">
        <Bar
          v-if="borrowersData.labels.length"
          :data="borrowersData"
          :options="horizontalBarOptions"
        />
      </div>
    </div>

    <!-- Top 5 Lenders -->
    <div class="rounded-xl border p-5 transition-colors duration-200"
      :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <h3 class="text-sm font-semibold mb-4"
        :class="isDark ? 'text-gray-200' : 'text-gray-800'">
        Top Lenders
      </h3>
      <div style="height: 220px;">
        <Bar
          v-if="lendersData.labels.length"
          :data="lendersData"
          :options="horizontalBarOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { useTheme } from '@/composables/useTheme'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const props = defineProps({
  totalReturned: { type: Number, default: 0 },
  totalRemaining: { type: Number, default: 0 },
  statusCounts: { type: Object, default: () => ({}) },
  topBorrowers: { type: Array, default: () => [] },
  topLenders: { type: Array, default: () => [] }
})

const { isDark } = useTheme()

const textColor = computed(() => isDark.value ? '#9ca3af' : '#6b7280')
const gridColor = computed(() => isDark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val || 0)
}

const doughnutData = computed(() => ({
  labels: ['Returned', 'Remaining'],
  datasets: [
    {
      data: [props.totalReturned, props.totalRemaining],
      backgroundColor: ['#10b981', '#ef4444'],
      borderColor: isDark.value ? '#111827' : '#fff',
      borderWidth: 3,
      hoverOffset: 6
    }
  ]
}))

const doughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${formatCurrency(ctx.parsed)}`
      },
      backgroundColor: isDark.value ? '#1f2937' : '#fff',
      titleColor: isDark.value ? '#e5e7eb' : '#111827',
      bodyColor: isDark.value ? '#9ca3af' : '#6b7280',
      borderColor: isDark.value ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 10
    }
  }
}))

const statusBarData = computed(() => ({
  labels: Object.keys(props.statusCounts),
  datasets: [
    {
      label: 'Count',
      data: Object.values(props.statusCounts),
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#dc2626'],
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}))

const barOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: isDark.value ? '#1f2937' : '#fff',
      titleColor: isDark.value ? '#e5e7eb' : '#111827',
      bodyColor: isDark.value ? '#9ca3af' : '#6b7280',
      borderColor: isDark.value ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 10
    }
  },
  scales: {
    x: {
      ticks: { color: textColor.value, font: { size: 11 } },
      grid: { display: false },
      border: { display: false }
    },
    y: {
      ticks: { color: textColor.value, font: { size: 11 }, stepSize: 1 },
      grid: { color: gridColor.value },
      border: { display: false }
    }
  }
}))

const borrowersData = computed(() => ({
  labels: props.topBorrowers.map((b) => b.name),
  datasets: [
    {
      label: 'Amount Borrowed',
      data: props.topBorrowers.map((b) => b.amount),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}))

const lendersData = computed(() => ({
  labels: props.topLenders.map((l) => l.name),
  datasets: [
    {
      label: 'Amount Lent',
      data: props.topLenders.map((l) => l.amount),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}))

const horizontalBarOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${formatCurrency(ctx.parsed.x)}`
      },
      backgroundColor: isDark.value ? '#1f2937' : '#fff',
      titleColor: isDark.value ? '#e5e7eb' : '#111827',
      bodyColor: isDark.value ? '#9ca3af' : '#6b7280',
      borderColor: isDark.value ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 10
    }
  },
  scales: {
    y: {
      ticks: { color: textColor.value, font: { size: 11 } },
      grid: { display: false },
      border: { display: false }
    },
    x: {
      ticks: {
        color: textColor.value,
        font: { size: 11 },
        callback: (v) => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
      },
      grid: { color: gridColor.value },
      border: { display: false }
    }
  }
}))
</script>
